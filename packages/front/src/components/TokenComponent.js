import React, { useState } from 'react';
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';

import { Button, Card, CardContent, TextField, Typography, Divider, List, ListSubheader, ListItem } from '@mui/material';
import ERC20 from '../contracts/ERC20.json';  // Assume the path to ERC20.json is correct

function TokenComponent() {
    const { connected, provider, account } = useSDK();
    const [contractAddress, setContractAddress] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [tokenBalance, setTokenBalance] = useState(null);
    const [transactionHashes, setTransactionHashes] = useState([]);

    const loadContract = async () => {
        if (connected && provider && contractAddress) {
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(ERC20.abi, contractAddress);
            try {
                const balance = await contract.methods.balanceOf(account).call();
                setTokenBalance(balance);
            } catch (error) {
                console.error('Error fetching token balance:', error);
                alert('Error fetching token balance');
            }
        }
    };

    const handleTransfer = async () => {
        if (connected && provider && contractAddress && recipientAddress && transferAmount) {
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(ERC20.abi, contractAddress);
            try {
                const calldata = contract.methods.transfer(recipientAddress, transferAmount).encodeABI()
                const result = await contract.methods.transfer(recipientAddress, transferAmount)
                    .send({ from: account, data: calldata }); // data param is workaround.
                console.log(result)
                setTransactionHashes(prevHashes => [...prevHashes, result.transactionHash]);  // Update transaction hashes
            } catch (error) {
                console.error('Error executing transfer:', error);
            }
        }
    };

    return (
        <div style={{marginTop: '20px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h5">Token Operations</Typography>
                    <TextField
                        label="Contract Address"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={loadContract}>
                        Load Contract
                    </Button>
                    <Divider style={{ margin: '20px 0' }} />
                    {tokenBalance !== null && (
                        <div>
                            <Typography variant="h4" style={{ marginBottom: '20px' }}>
                                Token Balance: {tokenBalance.toString()}
                            </Typography>
                            <Divider style={{ margin: '20px 0' }} />
                            <TextField
                                label="Recipient Address"
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Transfer Amount"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleTransfer} style={{ marginTop: '10px' }}>
                                Transfer Tokens
                            </Button>
                            {transactionHashes.length > 0 && (
                                <List
                                    subheader={
                                        <ListSubheader>
                                            Transaction Hashes:
                                        </ListSubheader>
                                    }>
                                    {transactionHashes.map((hash, index) => (
                                        <ListItem key={index}>
                                            <Typography variant="body1">
                                                <a
                                                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {hash}
                                                </a>
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default TokenComponent;