# リポジトリを初回把握する

## Overview

AI エージェントや新しい開発者が、初めてこのリポジトリで作業する前に全体像を把握するための手順です。

## Parameters

- **task_goal** (optional): 今回やりたい作業。
- **scope** (optional): 調査対象。例: `all`, `ui`, `backend`, `ops`。

## Prerequisites

- リポジトリのファイルを読める。
- 必要に応じてコマンドを実行できる。

## Steps

### 1. AI 用入口を読む

以下を順に確認する。

1. `AGENTS.md`
2. `ai-docs/PROJECT.md`
3. `ai-docs/CODEMAP.md`
4. 必要に応じて `DESIGN.md`、`ai-docs/ARCHITECTURE.md`、`ai-docs/TESTING.md`

**Constraints:**

- MUST 既存ルールを読まずに大きな変更を始めない。
- SHOULD タスクに関係ない文書を深追いしすぎない。

### 2. ファイル構成を確認する

```bash
find . -maxdepth 3 -type f | sort
```

大きいリポジトリでは以下を優先する。

```bash
rg --files
```

### 3. 技術スタックとコマンドを確認する

`package.json`、`pyproject.toml`、`go.mod`、`Cargo.toml`、`Makefile`、README などを確認する。

### 4. 作業対象の近くを読む

今回の作業に関係するファイル、テスト、docs を読む。

### 5. 古いドキュメントを見つけたら更新候補にする

明らかに実態と違う内容があれば、作業の一部として更新する。

## Verification

- 作業対象の入口ファイルが分かっている。
- 確認すべきテストやビルドコマンドが分かっている。
- 関連するルールや設計制約を把握している。

## Rollback / Recovery

- 調査で誤った前提を置いていた場合は、前提を訂正してから作業を進める。
- docs が古い場合は、実装を優先して確認し、docs を後で更新する。

## Related Files

- `AGENTS.md`
- `ai-docs/PROJECT.md`
- `ai-docs/CODEMAP.md`
- `ai-docs/ARCHITECTURE.md`
- `ai-docs/TESTING.md`
