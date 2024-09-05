# 2: SepoliaテストネットにContractをデプロイ

[1.ERC20Token Contract の作成](./1_CreateERC20Token.md)で作成した`MyToken`を [Sepolia] テストネットにデプロイする手順を説明します。

[Sepolia] テストネットにデプロイするためには手数料となる Sepolia ETH が必要です。そのため、まず最初に Wallet アプリである [MetaMask] をインストールし、Sepolia ETH を入手する手順を説明します。

次に、[Sepolia] に接続するために [infura.io] のサービスに登録して利用する手段を説明します。

最後に [Hardhat] を [Sepolia] と接続するためのネットワーク設定と、[infura.io] と [MetaMask] のアカウントを利用する設定を追加して、[Sepolia] に `MyToken` をデプロイする手順を説明します。

[Hardhat]: https://hardhat.org/
[Infura ダッシュボード]: https://app.infura.io
[infura.io]: https://www.infura.io/
[MetaMask]: https://metamask.io/
[Sepolia]: https://www.alchemy.com/overviews/sepolia-testnet

## 1. Chrome に MetaMask プラグインをインストール

- [MetaMask の公式ウェブサイト](https://metamask.io/download.html)または Chrome ウェブストアから MetaMask プラグインをダウンロードしてインストールします。
- [MetaMask] を開き、アカウントを作成します。アカウント作成時に表示される mnemonic（12 の単語）をメモしておきます。
- 後に秘密鍵が必要となるため、確認しておきます。秘密鍵の取得方法は以下の画像を参考にしてください。

![image](https://github.com/user-attachments/assets/e33fa243-7df0-494f-a0f3-967cc9e1ed02)

## 2. Sepolia テストネットの faucet から Sepolia ETH を入手

[MetaMask] で [Sepolia] テストネットを選択します。

![image](https://github.com/user-attachments/assets/973c15f2-a167-4995-b5da-70d671936083)

![image](https://github.com/user-attachments/assets/03e920fe-4ee6-482a-b218-94ffe9252baf)

[Sepolia Faucet]等の Faucet （フォーセット）」のにアクセスし、[MetaMask] のアドレスを入力して ETH をリクエストします。

![image](https://github.com/user-attachments/assets/9cf24fd3-904c-4b52-875d-ab09580aeeff)

- 注意: 同じウォレット アドレスで Ethereum Mainnet にいくつかの最低残高を保持していることを条件としている Faucet があります。
- 注意: Faucet の多くは 1 日 1 回しか ETH を入手できないため、必要に応じて計画的に行動してください。

[Sepolia Faucet]: https://sepoliafaucet.com/

## 3. Infura.io のアカウントを作成

- [infura.io] にアクセスし、新しいアカウントを作成します。
- アカウント作成後、[Infura ダッシュボード](https://app.infura.io)でプロジェクト用の API Key を取得し、それをコピーします。

![image](https://github.com/user-attachments/assets/91465a49-0e39-48b7-a1f5-9dc267fd566d)

## 4. hardhat.config.js に Sepolia テストネットのネットワーク情報を追加

`hardhat.config.js` ファイルをエディタで開き、以下のように デプロイ先の [Sepolia] ネットワークの設定を追加します。

初期状態では`solidity`の設定のみがあるので、その下に以下の`networks`設定を追記します。

[infura.io]の API Key と[MetaMask]の Sepolia ETH を持っているアカウント秘密鍵が必要となります。それらを設定ファイルに渡す方法の一つとして Hardhat の[Configuration variables](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables) (`vars`オブジェクト)があります。

```js
require("@nomicfoundation/hardhat-toolbox");

// infura.ioのAPI Key
const INFURA_API_KEY = vars.get("INFURA_API_KEY");

// MetamaskのSepolia ETHを持っているアカウントの秘密鍵
const ACCOUNT_PRIVATE_KEY = vars.get("ACCOUNT_PRIVATE_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
};
```

値の設定は以下のコマンドで行います。

```bash
$ npx hardhat vars set INFURA_API_KEY
$ npx hardhat vars set ACCOUNT_PRIVATE_KEY
```

現在設定されている値の確認は以下のコマンドで行います。

```bash
$ npx hardhat vars get INFURA_API_KEY
$ npx hardhat vars get ACCOUNT_PRIVATE_KEY
```

設定変数はディスク上に平文で保存されますので注意してください。

保存場所を見つけるには、以下のコマンドを実行します。

```bash
$ npx hardhat vars path
```

### 4.2 トークンのデプロイ (sepolia)

`localhost`にデプロイした時との違いは、`--network` オプションに `sepolia` を指定することのみです。

```bash
$ npx hardhat ignition deploy ./ignition/modules/MyToken.js --network sepolia
```

[Sepolia] などの [Hardhat] が認識しているネットワークにデプロイする場合には確認を求められます。良ければ`y` を入力します。

![image](https://github.com/user-attachments/assets/23c31e0d-f747-4aea-b57a-bb86a2a39aed)

デプロイ時に生成された`./ignition/deployments/chain-xxxxxx/journal.jsonl`ファイルで Transaction Hash と Contract Address を探し、メモして置きます。

## 6. etherscan で確認:

- [Sepolia Testnet Etherscan](https://sepolia.etherscan.io/)にアクセスし、Transaction Hash または Contract Address を使ってデプロイメントを確認します。

![etherscan](https://github.com/user-attachments/assets/fae39f88-bc67-4a81-94e3-73f751d5468a)

![etherscan](https://github.com/user-attachments/assets/82d62e8a-76a1-440d-93f8-9e408e82cf2c)

[1.ERC20Token Contractの作成](./1_CreateERC20Token.md) &lt;&lt;prev next&gt;&gt; - [3.SimpleなDappsの作成](./3_CreateSimpleDapps.md)
