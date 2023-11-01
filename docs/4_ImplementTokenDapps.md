# 4: ERC20Token Dappsの実装

ERC20 Tokenの残高確認と送金ができる機能を持つDappsの作成方法について説明します。
なお、事前に以下の手順に従ってERC20Token Contractの作成とデプロイ、それからシンプルなDappsを作成済みである前提で進めます。

- [1.ERC20Token Contractの作成](./1_CreateERc20Token.md)
- [2.SepoliaテストネットにContractをデプロイ](./2_DeploySepolia.md)
- [3.SimpleなDappsの作成](./CreateSimpleDapps.md)

これらの手順は全て、`packages/front`以下で作業する想定で記載しております。

### 2. **ERC20トークンのABIの保存**:

まず最初に、`src/contracts`ディレクトリを作成し、その中にtruffleで生成された`../contracts/build/contracts/ERC20.json`をコピーします。

この`ERC20.json`ファイルの中に、Javascriptやその他のクライアントライブラリからContractにアクセスするためのインターフェース情報（メソッド名やメソッドのID、必要なパラメータ情報など）が含まれています。これらの情報のことをABI（Application Binary Interface)と呼びます。

以下のコマンドを実行してディレクトリを作成し、`ERC20.json`ファイルをコピーしてください。

```bash
mkdir src/contracts
cp ../contracts/build/contracts/ERC20.json src/contracts/
```

なお、ERC20はインターフェース仕様が標準化されているため、以下の内容でファイルを直接生成しても良いです。

**src/contracts/ERC20.json**
```json
{
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_spender", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_from", "type": "address" },
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transferFrom",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "name": "", "type": "uint8" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transfer",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        { "name": "_owner", "type": "address" },
        { "name": "_spender", "type": "address" }
      ],
      "name": "allowance",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "name": "_initialAmount", "type": "uint256" },
        { "name": "_tokenName", "type": "string" },
        { "name": "_decimalUnits", "type": "uint8" },
        { "name": "_tokenSymbol", "type": "string" }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "_from", "type": "address" },
        { "indexed": true, "name": "_to", "type": "address" },
        { "indexed": false, "name": "_value", "type": "uint256" }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "_owner", "type": "address" },
        { "indexed": true, "name": "_spender", "type": "address" },
        { "indexed": false, "name": "_value", "type": "uint256" }
      ],
      "name": "Approval",
      "type": "event"
    }
  ]
}
```

### 3. **ERC20Tokenの管理機能を持つ新しいコンポーネントの作成**:

次に、`src/components`ディレクトリ内に`TokenComponent.js`という新しいファイルを作成します。

このコンポーネントではERC20Token Contractを操作するための簡単な以下の２つの機能を実装します。
- 指定されたERC20Tokenの残高を表示
- 指定されたERC20Tokenを送金

以下の内容を`TokenComponent.js`ファイルに貼り付けてください。

**src/components/TokenComponent.js**
```javascript
import React, { useState } from 'react';
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';

import { Button, Card, CardContent, TextField, Typography, Divider, List, ListSubheader, ListItem } from '@mui/material';
import ERC20 from '../contracts/ERC20.json';  // Assume the path to ERC20.json is correct
