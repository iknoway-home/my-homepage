# リリース・デプロイする

## Overview

本番（GitHub Pages）へリリースするための手順です。
このサイトは `main` ブランチの `/docs` がそのまま公開されるため、**プッシュ = デプロイ** です。

## Parameters

- **changes** (required): リリースする変更内容。
- **rollback_target** (optional): 問題発生時に戻すコミット SHA。

## Prerequisites

- `ai-docs/OPERATIONS.md` が現在の運用と一致している。
- `sops/run-quality-checks.sop.md` の確認が完了している。
- `main` へのプッシュ権限がある。

## Steps

### 1. リリース対象を確認する

変更内容と差分を確認する。

```bash
git status
git log --oneline -n 10
git diff
```

**Constraints:**

- MUST 意図しないファイル（`.DS_Store`、一時ファイル、`docs/` 外に置くべき内部ドキュメント）が差分に含まれていないことを確認する。
- MUST ユーザーの未コミット変更を勝手に含めたり戻したりしない。

### 2. 品質確認を実行する

`sops/run-quality-checks.sop.md` に従ってローカルサーバーで確認する。

### 3. コミットしてプッシュする

```bash
git add <対象ファイル>
git commit -m "変更内容が分かる短いメッセージ"
git push origin main
```

### 4. デプロイ後確認を行う

数分待ってから本番 URL を確認する。

- https://iknoway-home.github.io/my-website/ が開ける。
- 変更したテーマ・機能が反映されている（`?theme=<id>` で固定確認）。
- DevTools コンソールに重大なエラーがない。

反映されない場合は GitHub リポジトリの Pages / Actions タブでビルド状況を確認する。

### 5. ドキュメントを更新する

構成・手順が変わった場合は `ai-docs/OPERATIONS.md`、`README.md`、この SOP を更新する。

## Verification

- 本番 URL でリリース対象の変更が動いている。
- 主要テーマのスモークテスト（表示・切替）が完了している。
- 問題が出た場合のロールバック先コミットが分かる。

## Rollback / Recovery

| 方法 | 手順 | 注意 |
|---|---|---|
| コミットを打ち消す | `git revert <sha>` → `git push origin main` | 基本はこれ。履歴が残る |
| 特定ファイルだけ戻す | `git checkout <sha> -- <path>` → コミット・プッシュ | 影響範囲を最小化できる |

## Related Files

- `ai-docs/OPERATIONS.md`
- `ai-docs/TESTING.md`
- `sops/run-quality-checks.sop.md`
