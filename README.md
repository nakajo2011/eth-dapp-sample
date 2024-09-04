## Description
EthereumのDappsを作成するための最低限のサンプルです。

created at: 2023/10/25 

## Dependencies

主な依存ライブラリは以下のとおりです。

- contracts workspace (`packages/contracts/`配下)
  - [Hardhat]
  - [OpenZeppelin]
- front  (`packages/front/`配下)
  - [React]
  - [Parcel]

[Hardhat]: https://hardhat.org/
[OpenZeppelin]: https://www.openzeppelin.com/
[React]: https://ja.legacy.reactjs.org/
[Parcel]: https://parceljs.org/

## Getting Started
※Windowsを利用している場合はWSL2＋Ubuntu環境で実行してください。

### 1. Gitのインストール

macOSを利用している人はbrewを使ってインストールしてください。
```bash
brew install git
```

Linuxを利用している人は以下のサイトを参照してください。
https://git-scm.com/download/linux

### 2. NVMのインストール
公式に従い以下のコマンドでインストール
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

詳細は公式を参照: https://github.com/nvm-sh/nvm#install--update-script 

### 3. Node.js のインストール

[Hardhat 公式ドキュメント][Hardhat-setting-up-the-environment]によると、Node.js `>=18.0` が推奨とのことです。インストールされているNode.jsのバージョンは以下のコマンドで確認できます。

```bash
$ node --version
```

該当するNode.jsがインストールされていない場合は、NVMを使って Node.js 22 をインストールします。

```bash
nvm install 22.6
```

[Hardhat-setting-up-the-environment]: https://hardhat.org/tutorial/setting-up-the-environment

### 4. Install Yarn in global

```bash
npm install -g yarn 
```

### 5. Clone this repository
このリポジトリをcloneします。  
```bash
git clone https://github.com/nakajo2011/eth-dapp-sample.git
```

### 6. Install dependencies
依存ライブラリをyarnで全てインストールします。  
```bash
yarn install
```

### 7. Start app
依存ライブラリが問題なくインストールされたかチェックするために、サンプル画面が表示されるか試します。
```bash
yarn start
```

## How To Use This Repository

このリポジトリはdappsを作成するためのtemplateと手順を提供するためのものです。

dapps作成手順は以下のドキュメントを参照ください。

- [1.ERC20Token Contractの作成](docs/1_CreateERC20Token.md)

## How to use implemented branch
ContractとDappsをそれぞれ作成完了した時点のコードを以下の２つのbranchに保存しています。

- 1_erc20token
- 2_create_dapps

上記２つのリポジトリをチェックアウトして利用する方法を説明します。

### 1. 既存リポジトリの変更点を全てクリア
```bash
git reset HEAD --hard
```

### 2. branchをチェックアウト
指定したbranchに切り替えます。ここでは`1_erc20token`のbranchに切り替えています。

`git checkout`の詳細は以下のドキュメントを参照 https://www.atlassian.com/ja/git/tutorials/using-branches/git-checkout
```bash
git checkout -b 1_erc20token origin/1_erc20token
```

### 3. 依存ライブラリの再インストール
```bash
yarn install
```
