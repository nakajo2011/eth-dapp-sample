# 1: ERC20Token Contractの作成

Hardhat と OpenZeppelin を使用して ERC20 トークンを作成しする手順を説明します。また、作成した ERC20 トークンを Hardhat から操作する方法も説明します。

## 1. プロジェクトのセットアップ

### 1-1. 依存ライブラリのインストール

```bash
$ cd packages/contracts
$ yarn add --dev hardhat@2.22.3
$ yarn add --dev @openzeppelin/contracts@5.0.2
```

バージョンが変わると構成が変わったりなどでコンパイルが通らなくなることがあるので、依存ライブラリは記事執筆時にインストールしたバージョンを指定しています。

> [!Tip]  
> 以降のコマンドは`packages/contracts`ディレクトリで行います。  
> 新しいターミナルを開いた時は現在のディレクトリを確認して、適宜`cd`コマンドで移動してください。  

### 1.2. Hardhat プロジェクトの初期化

以下の初期化コマンドを実行すると、必要なフォルダや設定ファイル、依存ライブラリなどを自動で作成してくれます。

```bash
$ npx hardhat init
```

初期化コマンドを実行すると Hardhat プロジェクトの構成を聞かれます。ここでは先頭の JavaScript プロジェクトを選択します。

![](https://github.com/user-attachments/assets/7118207a-90fc-4582-b034-e27ec904cdea)

Enter キーで選択すると、次にプロジェクトルートのディレクトリを聞かれます。特段理由がなければ変更は不要です。

![](https://github.com/user-attachments/assets/fc9a77b4-733c-4be5-9f99-02411da71a9d)

次は.gitignore ファイルを作成していいかを聞かれる。特段理由がなければ `y` を選択します。

![](https://github.com/user-attachments/assets/24b222b6-c83e-4d6f-b52c-c35803b62459)

最後に 依存ライブラリをインストールして良いか聞かれます。Hardhat の基本的な機能を使うのに必要なものも多く含まれているので、特段理由がなければ `y` を選択します。

![](https://github.com/user-attachments/assets/c75cb0d9-28f1-41db-9fc9-71d1ecb20a78)

依存ライブラリ のインストールが終わればプロジェクト作成は完了です。

## 2. ERC20 トークンの作成

転送可能なトークンを実装するシンプルなスマートコントラクト(ERC20Token Contract)を作成し、Hardhat 内蔵のローカルノードにデプロイします。

### 2-1. コントラクトの作成

`contracts/MyToken.sol`という名前の新しいファイルを作成し、以下の内容をコピーして貼り付けます。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }
}
```

### 2-2. コントラクトのコンパイル

コントラクトをコンパイルするには、ターミナルで以下のコマンドを実行します。

```bash
$ npx hardhat compile
```

## 3. 開発用ノードのセットアップとデプロイ

Hardhat では ignition というプラグインを使ってデプロイ作業を簡略・整理します。

iginition はプロジェクト作成時に既にインストール済みです。

### 3-1. デプロイファイルを作成

コントラクトをデプロイするためのプログラムを作成します。

ここでは先ほど作成した `MyToken` をデプロイするため、`ignition/modules/MyToken.js`ファイルを以下の内容で作成します。

```js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const INITIAL_SUPPLY = 1_000_000_000_000_000n;

module.exports = buildModule("MyTokenModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", INITIAL_SUPPLY);

  const token = m.contract("MyToken", [initialSupply], {});

  return { token };
});
```

### 3-2. Ethereum の開発用ノードの起動

ターミナルを開き、以下のコマンドを実行すると Hardhat に内蔵されている Ethereum の開発用ノードが起動します。

```bash
$ npx hardhat node
```

### 3-3. トークンのデプロイ (localhost)

新しいターミナルを開き、以下のコマンドを実行して`MyToken`をデプロイします。

```bash
$ npx hardhat ignition deploy ./ignition/modules/MyToken.js --network localhost
```

![image](https://github.com/user-attachments/assets/415d3344-8609-4546-b5d9-8bbc53973af2)

デプロイが成功すると `ignition/deployments/` 配下にデプロイ結果を記録したファイルが Ethereum の Chain ID ごとに生成されます。
後から、コントラクト のアドレスや消費した手数料などを確認したい場合はここで確認することができます。

```bash
$ tree ./ignition/deployments
./ignition/deployments
└── chain-31337
    ├── artifacts
    │   ├── MyTokenModule#MyToken.dbg.json
    │   └── MyTokenModule#MyToken.json
    ├── build-info
    │   └── 8c294341b5374b800e4c9b17784958de.json
    ├── deployed_addresses.json
    └── journal.jsonl

4 directories, 5 files
```

また、開発用ノードのログでもどのような処理が実施されたのか確認できます。

![hardhat-deploy-output 2024-08-30 20-11-39](https://github.com/user-attachments/assets/6f5d74cd-ec84-4324-9011-331d99cd3e98)

next&gt;&gt; [2.SepoliaテストネットにContractをデプロイ](./2_DeploySepolia.md)
