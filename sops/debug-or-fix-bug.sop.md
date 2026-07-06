# バグを調査・修正する

## Overview

バグを再現し、原因を特定し、最小の変更で修正するための手順です。

## Parameters

- **symptom** (required): 起きている症状。
- **expected_behavior** (optional): 期待される挙動。
- **reproduction_steps** (optional): 再現手順。
- **risk_level** (optional): 低 / 中 / 高。

## Prerequisites

- `AGENTS.md` と `ai-docs/CODEMAP.md` を確認する。
- 関連するテストやログを確認できる。

## Steps

### 1. 症状と期待値を分ける

何が起きているか、何が正しいかを分けて書き出す。

**Constraints:**

- MUST 推測だけで修正しない。
- SHOULD 再現条件、入力、環境差分を確認する。

### 2. 再現する

可能なら最小手順で再現する。
再現できない場合は、ログ、スクリーンショット、関連コードから仮説を明確にする。

### 3. 原因箇所を探す

`ai-docs/CODEMAP.md` で入口を確認し、関連する実装を読む。

```bash
rg "<error message or related keyword>"
```

### 4. 最小変更で修正する

原因に直接関係する範囲だけを修正する。

**Constraints:**

- MUST 無関係なリファクタリングを混ぜない。
- MUST 既存のユーザー変更を勝手に戻さない。
- SHOULD 再発防止のテストを追加する。

### 5. 確認する

`sops/run-quality-checks.sop.md` と `ai-docs/TESTING.md` に従って確認する。

### 6. ドキュメントを更新する

バグの原因が設計、運用、設定、セキュリティ、既知制約に関わる場合は、関連 docs を更新する。

## Verification

- 再現手順で問題が解消している。
- 関連テストまたは手動確認が完了している。
- 副作用のありそうな近接機能を確認している。
- 必要な docs / SOP 更新が完了している。

## Rollback / Recovery

- 修正で別の問題が出た場合は、変更範囲を確認し、原因に関係する差分だけを戻す。
- データ修正や設定変更を伴う場合は、復旧手順を `ai-docs/OPERATIONS.md` または SOP に残す。

## Related Files

- `AGENTS.md`
- `ai-docs/CODEMAP.md`
- `ai-docs/TESTING.md`
- `sops/run-quality-checks.sop.md`
