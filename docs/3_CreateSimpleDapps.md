
# 3: SimpleなDappsの作成

Dappsでは主にReactやNext.jsを用いてclientアプリをSPAで実装します。これらのアプリから、EthereumやContractの操作を行います。
特に最近ではMetamaskと連携してEthereumに接続を行うことがデファクトスタンダードとなっています。
Metamaskはいわゆるwalletアプリであり、ChromeやFireFoxといったブラウザにプラグインとしてインストールして利用可能です。これによりユーザは通常のブラウザでDappsを操作できる様になります。

以下では最初にReactを用いてSPA(Single Page Application)を作成し、その後にMetamaskと連携してアカウント情報を取得する手順を説明します。

## 1. **ReactでSPAを作成**:

### 1-1. **ディレクトリの移動:**
- ターミナルを開き、`packages/front`ディレクトリに移動します。
```bash
cd packages/front
```

### 1-2. **Material-UIとRoutingライブラリのインストール:**
```bash
yarn add @mui/material @emotion/react @emotion/styled react-router
```

> [!IMPORTANT]  
> 演習問題1から続けてチャレンジしている人はhardhatの開発用ノードを`Ctrl+C`で止めておきましょう。  
> 止めておかないと、ライブラリのインストールに失敗してしまいます。  

### 1-3. **HTMLファイルの作成:**

最初にReactアプリケーションのエントリーページを作成します。このHTMLとJavascriptファイルにReactアプリが展開され表示されます。

- `src/index.html` ファイルを作成し、以下のコードを貼り付けます。
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="./index.js" type="module"></script>
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

- 次に`src/index.js` ファイルを作成し、以下のコードを貼り付けます。
```javascript
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container)
root.render(<App />);
```

### 1-4. **コンポーネントの作成**:

SPAとして表示する画面を実装します。

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

### 1-5. **メニューの作成**:

SPAのメニューを表示するためのコンポーネントを作成します。

- `components`フォルダに`Menu.js`という名前のファイルを作成します。

**src/components/Menu.js**:
```javascript
import React from 'react';
import { Link } from 'react-router';
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

### 1-6. **ルーティングの設定**:

次に、SPAとして複数ページを表示可能にするために、ルーティング機能を実装します。今回は１つの画面のみしか利用しませんが、ルーティング機能を持たせることで今後の拡張を容易にします。

- `src`ディレクトリに`App.js`という名前のファイルを作成します。
- `App.js`に以下の内容をコピーして貼り付けます。

**src/App.js**:
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
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

### 1-7. **`packages/front/package.json`にスクリプトを追加:**

Reactアプリを簡単に起動できる様にショートカットコマンドを作成します。

- `packages/front` の `package.json` ファイルに以下の `scripts` セクションを追加または編集します。

```json
"scripts": {
    "start": "parcel src/index.html --open",
    "build": "parcel build src/index.html",
    "clean": "rm -rf ../../.parcel-cache dist/*"
}
```

- `start`は作成したReactアプリをローカルで実行してブラウザで確認するためのコマンドです。
- `build`は作成したReeactアプリを実際にサーバに展開するために必要最小限のJavascriptファイルに変換するためのコマンドです。
- `clean`は`build`や`start`で生成されたファイルを全て削除して環境を掃除するためのコマンドです。

### 1-8. **アプリケーションの実行:**
- `packages/front` ディレクトリに移動してターミナルで以下のコマンドを実行し、アプリケーションを起動します。
```bash
yarn start
```
- このコマンドはParcelを使用してアプリケーションをビルドし、ローカルサーバーを起動します。ブラウザが自動で開き、SPAのホームページが表示されるはずです。

## 2. **`@metamask/react-sdk`を用いてMetamaskと連携する**:

続いて、作成したSPAにMetamaskと連携する機能を追加します。

### 2-1. **必要なライブラリのインストール**:

ターミナルを開いて、`packages/front` ディレクトリに移動し、以下のコマンドを実行します。@metamask/sdk-reactとbn.jsライブラリをインストールします。
`yarn start`でReactアプリを実行中の場合は、`CTL+C`で終了させてください。

```bash
yarn add @metamask/sdk-react bignumber.js
```

@metamask/sdk-reactはreactでMetamaskと連携するために必要なライブラリです。bn.jsは大きな数字を扱うためのライブラリです。Ethereumでは1 ETH = 10^18 wei であり、wei単位で数字を扱うため、通常のintegerでは表現できないため、BNライブラリを利用して単位数値を扱います。

### 2-2. **src/App.jsの更新**:

次に、App.jsファイルを更新します。MetaMaskProviderコンポーネントをインポートし、アプリケーションのルートコンポーネントとして使用します。これにより、`@metamask/sdk-react`のフックとコンポーネントがアプリケーション全体で利用可能になります。

以下に、修正後の`src/App.js`のソースコードを示します。

**src/App.js**:
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { MetaMaskProvider } from '@metamask/sdk-react';
import Menu from './components/Menu';
import Home from './components/Home';

function App() {
  return (
    <MetaMaskProvider>
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
```


### 2-3. **src/components/Home.jsの更新**:
最後に、Home.jsファイルを更新します。

useSDKフックを使用してMetaMask SDKのインスタンス、接続ステータス、およびアカウント情報を取得します。

connect関数を定義してMetaMaskに接続し、接続ボタンをクリックすることでMetaMaskの接続プロンプトを表示します。

weiToEth関数を定義して、バランスを16進数から10進数に変換し、その後Wei単位からEther単位に変換します。

formattedBalance変数を使用して、バランスをフォーマットし、画面に表示します。
MetaMaskが接続されている場合、アカウントの詳細を表示するカードを表示します。これには、アカウントのアドレスとバランスが含まれます。

以下に修正後の`src/components/Home.js`のコードを示します。

**src/components/Home.js**:
```javascript
import React from 'react';
import { useSDK } from '@metamask/sdk-react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import BigNumber from "bignumber.js";

function Home() {
  const { sdk, connected, connecting, provider, chainId, account, balance } = useSDK();

  const connect = async () => {
    if (!connected && !connecting && sdk) {
      await sdk.connect();
    }
  };

  const weiToEth = (wei) => {
    const weiBN = new BigNumber(wei, 16);  // Convert hex string to BN instance
    const divisor = new BigNumber(10).pow(new BigNumber(18));  // 1 Ether = 10^18 Wei
    return weiBN.div(divisor).decimalPlaces(5);  // Convert Wei to Ether
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

> [!TIP]  
> 実行時に`@parcel/bundler-default: Expected content key 1e8cafef6f979bdd to exist`といったエラーが出る場合は、以下のコマンドでキャッシュを削除してから再度実行してください。
> ```bash
> yarn clean
> ```

## 3. addressコピーボタンの追加

最後に少しだけ便利機能を実装します。

ユーザーがアカウントのアドレスを簡単にコピーできるように、コピーアイコンボタンを追加します。

### 3-1. iconライブラリの追加:

iconを扱えるようにするために`@mui/icons-material`ライブラリをインストールします。

```bash
yarn add @mui/icons-material
```

### 3-2. 必要なコンポーネントのインポート:

```javascript
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@mui/material';
```
上記のコードで`ContentCopyIcon`と`IconButton`コンポーネントをインポートします。これにより、コピー機能のアイコンボタンを表示できます。

### 3-3. `copyAddressToClipboard`関数の定義:
```javascript
const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(account);
};
```
`copyAddressToClipboard`関数を定義し、この関数は`navigator.clipboard.writeText`メソッドを使用してアカウントのアドレスをクリップボードにコピーします。

### 3-4. アイコンボタンの追加:
```javascript
<div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography variant="body1">Address: {account}</Typography>
    <IconButton onClick={copyAddressToClipboard}>
        <ContentCopyIcon />
    </IconButton>
</div>
```
アカウントアドレスの横にコピー用のアイコンボタンを追加しています。ユーザーがこのボタンをクリックすると、`copyAddressToClipboard`関数が呼び出され、アドレスがクリップボードにコピーされます。

### 3-5. 修正後の`Home.js`の全てのコード:

上記修正を施した最終的なHome.jsのコードを提示します。

**src/components/Home.js**
```javascript
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
```

[2.SepoliaテストネットにContractをデプロイ](./2_DeploySepolia.md) &lt;&lt;prev next&gt;&gt; [4. ERC20Token Dappsの実装](./4_ImplementTokenDapps.md)
