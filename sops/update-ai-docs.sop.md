# AI 用ドキュメントを棚卸し・更新する

## Overview

`AGENTS.md`、`DESIGN.md`、`ai-docs/`、`sops/` が現在の実装や運用と合っているか確認し、必要な範囲だけ更新する手順です。
毎回すべてを更新する必要はありません。5 回程度の意味ある変更、または 30 日程度を目安に実行します。

## Parameters

- **scope** (optional): 棚卸し対象。例: `all`, `ui`, `backend`, `ops`, `security`。
- **since** (optional): 確認する変更範囲。例: 前回更新以降、直近 30 日、特定コミット以降。

## Prerequisites

- リポジトリの現在の状態を確認できる。
- 主要な README、設定ファイル、実装入口を読める。
- git がある場合は変更履歴を確認できる。

## Steps

### 1. 現状を確認する

まず鮮度チェックスクリプトを実行し、陳腐化の度合いと未記入項目の残数を確認する。

```bash
bash scripts/ai-docs-status.sh
```

git がある場合は、直近の変更や未コミット差分も確認する。

```bash
git status
git log --oneline -n 20
```

**Constraints:**

- MUST ユーザーの未コミット変更を勝手に戻さない。
- SHOULD git がない場合は、ファイル構成と更新日時から判断する。

### 2. 実態とドキュメントのずれを探す

以下を重点的に確認する。

- ディレクトリ構成。
- 主要機能の置き場所。
- 起動、ビルド、テスト、デプロイ手順。
- 環境変数と外部サービス。
- UI 方針、コンポーネント、デザイントークン。
- セキュリティ、権限、秘密情報の扱い。
- SOP 化すべき繰り返し作業。

### 3. 必要なファイルだけ更新する

更新対象の目安:

| 変更内容 | 更新先 |
|---|---|
| 作業ルール、命名、配置 | `AGENTS.md` |
| UI / UX / デザイン | `DESIGN.md` |
| プロジェクト概要 | `ai-docs/PROJECT.md` |
| 機能の置き場所 | `ai-docs/CODEMAP.md` |
| 設計、境界、依存 | `ai-docs/ARCHITECTURE.md` |
| 意思決定 | `ai-docs/DECISIONS.md` |
| 優先度、今後の方針 | `ai-docs/ROADMAP.md` |
| 環境変数、外部サービス | `ai-docs/ENVIRONMENT.md` |
| テスト、確認コマンド | `ai-docs/TESTING.md` |
| 運用、リリース、復旧 | `ai-docs/OPERATIONS.md` |
| セキュリティ | `ai-docs/SECURITY.md` |
| 再利用手順 | `sops/*.sop.md` |
| ツール固有 rules / skill / subagent | `.cursor/rules/`, `.claude/rules/`, `.github/copilot-instructions.md`, `.claude/skills/`, `.claude/agents/`（手順は `sops/create-tool-rule-or-skill.sop.md`） |

**Constraints:**

- MUST 古い情報を残さない。
- MUST 実装されていないことを実装済みのように書かない。
- SHOULD 変更がないファイルは触らない。

### 4. 未記入項目を減らす

判明している情報で未記入項目を埋める。

**Constraints:**

- MUST プロジェクトに該当しない項目は「なし」と書く。未記入項目は未調査・未決定の意味でだけ残す。
- SHOULD 分からない項目を推測で埋めない。

### 5. 追加候補ドキュメントの作成要否を判断する

`AGENTS.md` の「追加候補ドキュメントの自動作成」の条件を満たしたものがあれば作成する
（`ai-docs/API.md`、`ai-docs/DATA.md`、`ai-docs/PERFORMANCE.md`、`ai-docs/GLOSSARY.md`）。
作成したら `AGENTS.md` の表、README のファイル一覧、`ai-docs/DECISIONS.md` も更新する。

### 6. SOP の追加要否を判断する

同じ作業を次回も使いそうな場合は `sops/create-or-update-sop.sop.md` に従って SOP を作成・更新する。

### 7. rules / skill の追加要否を判断する

SOP では足りず、特定 AI ツールに常時適用したい制約や、複数リポジトリで再利用する専門ワークフローがある場合は `sops/create-tool-rule-or-skill.sop.md` に従って作成・更新する。

**Constraints:**

- MUST `AGENTS.md` や既存 SOP で足りるなら rules / skill を作らない。
- SHOULD 詳細をツール別ファイルに重複させず、`AGENTS.md`、`ai-docs/`、`sops/` への参照に留める。

### 8. 更新後に確認する

リンク切れ、存在しないファイル名、存在しないコマンドがないか確認する。
最後にもう一度 `bash scripts/ai-docs-status.sh` を実行し、不要な警告が減っていることを確認する。

## Verification

- 実装と文書の明らかな不一致がない。
- 主要機能の入口が `ai-docs/CODEMAP.md` から辿れる。
- 重要な設計判断が `ai-docs/DECISIONS.md` に残っている。
- 現在の優先度やスコープ外が `ai-docs/ROADMAP.md` と矛盾していない。
- 繰り返す作業が `sops/` に切り出されている。
- ツール固有 rules / skill が必要な場合だけ作成され、重複していない。
- 変更していない文書に不要な差分がない。

## Rollback / Recovery

- 誤って古い情報を書いた場合は、実装の現在地を読み直して修正する。
- 不要な文書を追加した場合は、関連情報を適切な既存文書に統合して削除する。

## Related Files

- `AGENTS.md`
- `DESIGN.md`
- `ai-docs/`
- `sops/create-or-update-sop.sop.md`
- `sops/create-tool-rule-or-skill.sop.md`
- `scripts/ai-docs-status.sh`
- `.claude/settings.json`
- `.github/workflows/ai-docs-freshness.yml`
