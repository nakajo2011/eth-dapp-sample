import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MetaMaskProvider } from '@metamask/sdk-react';
import Menu from './components/Menu';
import Home from './components/Home';

function App() {
    return (
        <MetaMaskProvider
            sdkOptions={{
                dappMetadata: {
                name: "Example React Dapp",
                url: "http://localhost:8545",
                },
                // Other options.
            }}
        >
            <Router>
                <Menu />
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
        </MetaMaskProvider>
    );
}

export default App;