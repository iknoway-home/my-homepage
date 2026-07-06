# 品質確認を実行する

## Overview

変更後にローカルサーバーでの表示確認と手動チェックを実行するための手順です。
このプロジェクトには lint / 型チェック / 自動テスト / ビルドは存在しません（素の HTML / CSS / JS）。

## Parameters

- **scope** (optional): 確認範囲。例: `changed-theme`, `all-themes`, `shared`。
- **risk_level** (optional): 低 / 中 / 高。

## Prerequisites

- `ai-docs/TESTING.md` に確認手順が記録されている。
- Python 3 または Node.js（`npx serve`）が使える。

## Steps

### 1. 確認手順を読む

`ai-docs/TESTING.md` の確認コマンドと手動確認表を確認する。

### 2. ローカルサーバーを起動する

```bash
cd docs && python3 -m http.server 8080
# または
npx serve docs
```

### 3. 変更範囲に合う確認を実行する

- 変更したテーマ: `http://localhost:8080/?theme=<id>` で固定表示して確認。
- `docs/shared/` の変更: 通常テーマ 2〜3 種 + 特殊構造テーマ（`fantasy-book` など）で確認。
- `data.js` のスキーマ変更: 全テーマを一巡確認。
- テーマ切替: ページ内 Switch ボタン / `?switch=1` で必ず別テーマに切り替わる。

**Constraints:**

- MUST 存在しないコマンド（npm test など）を実行したことにしない。
- MUST 確認できなかった項目は、未確認である事実を記録する。
- SHOULD 小さな変更では関連確認を優先し、高リスク変更（shared / data.js / theme-router.js）では広く確認する。

### 4. UI 変更を手動確認する

UI 変更がある場合は以下を見る。

- PC とモバイル幅（DevTools デバイスモード）で崩れていない。
- テキストがはみ出していない。
- クリック / タップできる範囲が十分。
- 不要な横スクロールがない。
- DevTools コンソールにエラー・`console.log` 残りがない。
- `prefers-reduced-motion` 有効時に過剰な動きが止まる。

### 5. 確認結果を更新する

確認手順が変わった場合は `ai-docs/TESTING.md` を更新する。

## Verification

- 実行した確認と結果が説明できる。
- 未実行の確認がある場合は理由が明確。
- 問題がある場合は、修正済みか、残リスクとして明示されている。

## Rollback / Recovery

- 確認で重大な問題が出た場合は、原因箇所を特定し、関連変更だけを修正する。
- 確認手順自体が古い場合は、実態に合わせて `ai-docs/TESTING.md` を更新する。

## Related Files

- `ai-docs/TESTING.md`
- `AGENTS.md`
- `DESIGN.md`
