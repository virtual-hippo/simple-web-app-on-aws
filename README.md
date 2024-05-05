# simple-web-app-on-aws

AWS 上に Web アプリケーションを構築するサンプルプロジェクトです。

## 1 はじめに

### 1.1 このリポジトリの目的

あくまで個人的な勉強のためのリポジトリになります。
以下が主な勉強対象です。

- pnpm を利用したモノレポ構成
- AWS CDK
- CDK + github + CodePipeline で作成する CD
- React

### 1.2 主な使用(予定)技術

- Application
  - TypeScript
  - React.js
  - Vite
  - AWS Amplify Auth
- AWS
  - AWS CDK
  - CodePipeline
  - API Gateway
  - Lambda
  - DynamoDB
  - CloudFront
  - S3

### 1.3 ディレクトリ構成(予定)

```shell
├── docs        # このリポジトリに関するドキュメント保存用のディレクトリ
├── imgs        # ドキュメントに用いる画像保存用のディレクトリ
├── apps
│  ├── cdk          # AWS CDK 用のディレクトリ
│  │  └── lambda    # AWS Lambda 関数ソースコード格納用ディレクトリ
│  └── web-client   # React で作成する Web アプリケーション用のディレクトリ
├── LICENSE
└── README.md
```

## 2 作成する Web アプリケーションについて

### 2.1 対象領域

シンプルな ToDo アプリケーションを作成します。

### 2.2 概念モデル

## 3 使い方

- [1 準備](/docs/01_PREPARATION.md)
- [2 ローカルマシンでの実行](/docs/02_EXECUTION_ON_LOCAL_MACHINE.md)
- [3 AWS へのデプロイ](/docs/03_DEPLOY_TO_AWS.md)

## 4 アーキテクチャ

---

## 参考にしたリポジトリ

### [aws-samples/simple-lex-kendra-jp](https://github.com/aws-samples/simple-lex-kendra-jp)

日本語に最適化されたシンプルな Amazon Lex v2 と Amazon Kendra のサンプルプロジェクトです。
CDK の勉強にも RAG の勉強にもなります。
各ドキュメントが日本語で書かれているのがとてもありがたいです。

### [kgrzybek/modular-monolith-with-ddd](https://github.com/kgrzybek/modular-monolith-with-ddd)

モジュラモノリス + DDD のサンプルプロジェクトです。
サンプルプロジェクトではあまり見かけないレベルの複雑なドメインを扱っています。
丁寧に書かれた README を読むだけでも勉強になります。
