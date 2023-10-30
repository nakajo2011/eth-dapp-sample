このドキュメントでは作成したMyTokenをSepoliaテストネットにデプロイする手順を説明します。
Sepoliaテストネットにデプロイするためには手数料となるSepoliaETHが必要です。そのため、まず最初にWalletアプリであるMetamaskをインストールし、SepoliaETHを入手する手順を説明します。

次に、Sepoliaに接続するためにInfura.ioのサービスに登録して利用する手段を説明します。

最後にTruffleにSepoliaと接続するためのネットワーク設定と、Infura.ioとMetamaskのアカウントを利用する設定を追加して、SepoliaにMyTokenをデプロイする手順を説明します。
承知しました。`images/infuraio_endpoints.png` の画像を表示するように手順を修正しました。以下に修正された手順を示します。

### 1. **ChromeにMetamaskプラグインをインストール**:
   - [Metamaskの公式ウェブサイト](https://metamask.io/download.html)またはChromeウェブストアからMetamaskプラグインをダウンロードしてインストールします。
   - Metamaskを開き、アカウントを作成します。アカウント作成時に表示されるmnemonic（12の単語）をメモしておきます。このmnemonicは後でHDWalletProviderの設定に使用します。

### 2. **Infura.ioのアカウントを作成**:
   - [Infura.io](https://infura.io/) にアクセスし、新しいアカウントを作成します。
   - アカウント作成後、Infuraダッシュボードで新しいプロジェクトを作成し、プロジェクトのエンドポイントURLをコピーします。
   ![Infura Endpoints](images/infuraio_endpoints.png)

### 3. **SepoliaテストネットのfaucetからETHを入手**:
   - MetamaskでSepoliaテストネットを選択します。
   - [Sepolia faucet](https://sepoliafaucet.com/)にアクセスし、Metamaskのアドレスを入力してETHをリクエストします。注意: このfaucetは1日1回しかETHを入手できないため、必要に応じて計画的に行動してください。

### 4. **truffle-config.jsonにSepoliaテストネットのネットワーク情報を追加**:
   - `truffle-config.json` ファイルをエディタで開き、以下のようにSepoliaネットワークの設定を追加します。

```javascript
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(
        "your mnemonic goes here", // ここにMetamaskのmnemonicを直接指定
        "https://<your-project-id>.infura.io/v3/<your-project-secret>"  // InfuraのSepoliaエンドポイントURLを指定
      ),
      network_id: 11155111,       // SepoliaのネットワークID
      gas: 1000000,             // Gas limitを指定
      // gasPriceは指定しない
    },
    // ...other networks
  },
  // ...rest of the truffle-config.js
};
```

### 5. **truffleコマンドを用いてSepoliaにMyTokenをデプロイ**:
   - ターミナルを開き、プロジェクトのルートディレクトリに移動します。
   - 以下のコマンドを実行してMyTokenをSepoliaテストネットにデプロイします。

```bash
truffle migrate --network sepolia
```

### 6. **etherscanで確認**:
   - デプロイが成功すると、Truffleはトランザクションハッシュとコントラクトアドレスを出力します。
   - [Sepolia Testnet Etherscan](https://sepolia.etherscan.io/)にアクセスし、トランザクションハッシュまたはコントラクトアドレスを使ってデプロイメントを確認します。
