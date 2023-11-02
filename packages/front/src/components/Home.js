import React from 'react';
import { useSDK } from '@metamask/sdk-react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@mui/material';

function Home() {
    const { sdk, connected, connecting, provider, chainId, account, balance } = useSDK();

    const connect = async () => {
        if (!connected && !connecting && sdk) {
            await sdk.connect();
        }
    };

    const weiToEth = (wei) => {
        const weiBN = new BigNumber(wei.substring(2), 16);  // Convert hex string to BN instance
        const divisor = new BigNumber(10).pow(new BigNumber(18));  // 1 Ether = 10^18 Wei
        return weiBN.div(divisor).decimalPlaces(5);  // Convert Wei to Ether
    };

    const formattedBalance = balance ? weiToEth(balance) : null;

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
                            <Typography variant="body1">Balance: {formattedBalance ? `${formattedBalance} ETH` : 'Loading...'}</Typography>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default Home;