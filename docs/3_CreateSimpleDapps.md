
# シンプルなDappsの作成手順

Dappsでは主にReactやNext.jsを用いてclientアプリをSPAで実装します。これらのアプリから、EthereumやContractの操作を行います。
特に最近ではMetamaskと連携してEthereumに接続を行うことがデファクトスタンダードとなっています。
Metamaskはいわゆるwalletアプリであり、ChromeやFireFoxといったブラウザにプラグインとしてインストールして利用可能です。これによりユーザは通常のブラウザでDappsを操作できる様になります。

以下では最初にReactを用いてSPA(Single Page Application)を作成し、その後にMetamaskと連携してアカウント情報を取得する手順を説明します。

## 1. **Reactアプリケーションのセットアップ**:

### a. **ディレクトリの移動:**
- ターミナルを開き、`packages/front`ディレクトリに移動します。
```bash
cd packages/front
```

### b. **Material-UIとRoutingライブラリのインストール:**
```bash
yarn add @mui/material @emotion/react @emotion/styled react-router-dom
```

### c. **HTMLファイルの作成:**

- `src/index.html` ファイルを作成し、以下のコードを貼り付けます。
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
    <script src="./index.js" type="module"></script>
</body>
</html>
```

### d. **コンポーネントの作成**:
- `src`ディレクトリに`components`という名前のフォルダを作成します。
- `components`内に`Home.js`というファイルを作成します。

**src/components/Home.js**:
```javascript
import React from 'react';

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

export default Home;
```

### e. **メニューの作成**:
- `components`フォルダに`Menu.js`という名前のファイルを作成します。

**src/components/Menu.js**:
```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Menu() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My SPA
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Menu;
```

### f. **ルーティングの設定**:
- `src`ディレクトリに`App.js`という名前のファイルを作成します。

**src/App.js**:
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### g. **`packages/front/package.json`にスクリプトを追加:**
- Reactアプリを簡単に起動できる様にショートカットコマンドを作成します。`packages/front` の `package.json` ファイルに以下の `scripts` セクションを追加または編集します。

```json
"scripts": {
    "start": "parcel index.html --open",
    "build": "parcel build index.html"
}
```

### i. **アプリケーションの実行:**
- `packages/front` ディレクトリに移動してターミナルで以下のコマンドを実行し、アプリケーションを起動します。
```bash
yarn start
```
- このコマンドはParcelを使用してアプリケーションをビルドし、ローカルサーバーを起動します。ブラウザが自動で開き、SPAのホームページが表示されるはずです。

## 2. **`@metamask/react-sdk`を用いてMetamaskと連携する**:

続いて、作成したSPAにMetamaskと連携する機能を追加します。

### a. **必要なライブラリのインストール**:

ターミナルを開いて、`packages/front` ディレクトリに移動し、以下のコマンドを実行します。@metamask/sdk-reactとbn.jsライブラリをインストールします。

```bash
yarn add @metamask/sdk-react bn.js
```

@metamask/sdk-reactはreactでMetamaskと連携するために必要なライブラリです。bn.jsは大きな数字を扱うためのライブラリです。Ethereumでは1 ETH = 10^18 wei であり、wei単位で数字を扱うため、通常のintegerでは表現できないため、BNライブラリを利用して単位数値を扱います。

### b. **src/App.jsの更新**:

次に、App.jsファイルを更新します。MetaMaskProviderコンポーネントをインポートし、アプリケーションのルートコンポーネントとして使用します。これにより、`@metamask/sdk-react`のフックとコンポーネントがアプリケーション全体で利用可能になります。

以下に、修正後の`src/App.js`のソースコードを示します。

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MetaMaskProvider } from '@metamask/sdk-react';
import Menu from './components/Menu';
import Home from './components/Home';
import Detail from './components/Detail';

function App() {
  return (
    <MetaMaskProvider>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </Router>
    </MetaMaskProvider>
  );
}

export default App;
```


### c. **src/components/Home.jsの更新**:
最後に、Home.jsファイルを更新します。

useSDKフックを使用してMetaMask SDKのインスタンス、接続ステータス、およびアカウント情報を取得します。

connect関数を定義してMetaMaskに接続し、接続ボタンをクリックすることでMetaMaskの接続プロンプトを表示します。

weiToEth関数を定義して、バランスを16進数から10進数に変換し、その後Wei単位からEther単位に変換します。

formattedBalance変数を使用して、バランスをフォーマットし、画面に表示します。
MetaMaskが接続されている場合、アカウントの詳細を表示するカードを表示します。これには、アカウントのアドレスとバランスが含まれます。

以下に修正後の`src/components/Home.js`のコードを示します。

```javascript
import React from 'react';
import { useSDK } from '@metamask/sdk-react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import BN from 'bn.js';

function Home() {
  const { sdk, connected, connecting, provider, chainId, account, balance } = useSDK();

  const connect = async () => {
    if (!connected && !connecting && sdk) {
      await sdk.connect();
    }
  };

  const weiToEth = (wei) => {
    const weiBN = new BN(wei, 16);  // Convert hex string to BN instance
    const divisor = new BN(10).pow(new BN(18));  // 1 Ether = 10^18 Wei
    return weiBN.div(divisor).toString(10);  // Convert Wei to Ether
  };

  const formattedBalance = balance ? weiToEth(balance) : null;

  return (
    <div style={{ padding: '20px' }}>
      <Button variant="contained" color="primary" onClick={connect} disabled={connected || connecting}>
        Connect to MetaMask
      </Button>
      {connected && account && (
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h5">Account Details</Typography>
            <Typography variant="body1">Address: {account}</Typography>
            <Typography variant="body1">Balance: {formattedBalance ? `${formattedBalance} ETH` : 'Loading...'}</Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Home;
```

以上の手順でMetamaskと連携して、アカウントのアドレスと残高を表示するSPAが完成します。
最後に以下のコマンドを実行して実際にMetamaskと連携できるか確認して下さい。

```bash
yarn start
```

実行前にあらかじめ、[Metamaskの公式ページ](https://metamask.io/download/)にアクセスしてChromeブラウザにMetamaskプラグインをインストールしておいてください。