import { createRoot } from "react-dom/client";
import { App } from "./App";
import { MetaMaskProvider } from '@metamask/sdk-react';

const container = document.getElementById("app");
const root = createRoot(container)
root.render(
  <React.StrictMode>
  <MetaMaskProvider debug={false} sdkOptions={{
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Demo React App",
      url: window.location.host,
    }
  }}>
    <App />
  </MetaMaskProvider>
</React.StrictMode>
);   