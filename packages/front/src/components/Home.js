import { useSDK } from '@metamask/sdk-react';
import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@mui/material';
import TokenComponent from "./TokenComponent";
import Web3 from 'web3';

function Home() {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [formattedBalance, setFormattedBalance] = useState(null);
    const { sdk, connected, connecting, provider, chainId } = useSDK();

    const web3 = new Web3(provider);

    // MetaMaskに接続する関数
    const connect = async () => {

        // MetaMaskのネットワークをlocalhostに変更
        // localhostの接続情報がMetaMaskに追加されてない場合は追加要求を行う
        try {
            await provider // Or window.ethereum if you don't support EIP-6963.
              .request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x7a69" }],
              })
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await provider // Or window.ethereum if you don't support EIP-6963.
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: "0x7a69",
                        chainName: "localhost",
                        rpcUrls: ["http://localhost:8545"] /* connect to hardhat */,
                        nativeCurrency: {
                          name: "localhost",
                          symbol: "GO",
                          decimals: 18,
                        },
                      },
                    ],
                  })
              } catch (addError) {
                // Handle "add" error.
                alert("failed to add network..", addError);
              }
            }
            // Handle other "switch" errors.
          }
          
        // MetaMaskからアカウント情報等を取得
        try {
            const accounts = await sdk?.connect();
            const account = accounts?.[0];
            const balance = await web3.eth.getBalance(account)
            const formattedBalance = balance != null ? weiToEth(balance) : null;
            setAccount(account);
            setBalance(balance);
            setFormattedBalance(formattedBalance);
            console.log(balance, formattedBalance);
          } catch (err) {
            alert("failed to connect..", err);
          }
    };

    // Componentロード時にMetaMaskに接続する
    useEffect(() => {
        const fetchAccountData = async () => {
            if (connected) {
                try {
                    const accounts = await provider.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts[0]);
                    const balance = await web3.eth.getBalance(accounts[0]);
                    setBalance(balance);
                    setFormattedBalance(web3.utils.fromWei(balance, 'ether'));
                } catch (error) {
                    console.error("Failed to fetch account data", error);
                }
            }
        };

        fetchAccountData();
    }, [provider]);

    const weiToEth = (wei) => {
        const weiBN = new BigNumber(wei);  // Convert hex string to BN instance
        const divisor = new BigNumber(10).pow(new BigNumber(18));  // 1 Ether = 10^18 Wei
        return weiBN.div(divisor).decimalPlaces(5);  // Convert Wei to Ether
    };


    const copyAddressToClipboard = () => {
        navigator.clipboard.writeText(account);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Button variant="contained" color="primary" onClick={connect} disabled={connected || connecting}>
                Connect to MetaMask
            </Button>
            {connected && account && (
                <div>
                    <Card style={{ marginTop: '20px' }}>
                        <CardContent>
                            <Typography variant="h5">Account Details</Typography>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">Address: {account}</Typography>
                                <IconButton onClick={copyAddressToClipboard}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </div>
                            <Typography variant="body1">Balance: {formattedBalance != undefined ? `${formattedBalance} ETH` : 'Loading...'}</Typography>
                        </CardContent>
                    </Card>
                    <TokenComponent />  {/* Add this line */}
                </div>
            )}
        </div>
    );
}

export default Home;