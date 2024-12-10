import { useSDK } from '@metamask/sdk-react';
import React, { useState } from "react";
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
    const connect = async () => {
        try {
          const accounts = await sdk?.connect();
          const account = accounts?.[0];
          const balance = await web3.eth.getBalance(account)
          const formattedBalance = balance ? weiToEth(balance) : null;
          setAccount(account);
          setBalance(balance);
          setFormattedBalance(formattedBalance);
        } catch (err) {
          alert("failed to connect..", err);
        }
    };

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
            <Button variant="contained" color="primary" onClick={connect} disabled={connected && account != undefined}>
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
                            <Typography variant="body1">Balance: {formattedBalance ? `${formattedBalance} ETH` : 'Loading...'}</Typography>
                        </CardContent>
                    </Card>
                    <TokenComponent />  {/* Add this line */}
                </div>
            )}
        </div>
    );
}

export default Home;