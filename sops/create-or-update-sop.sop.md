# SOP を作成・更新する

## Overview

再利用できる作業手順を `*.sop.md` として作成・更新するための手順です。
セットアップ、リリース、調査、復旧、外部連携など、次回も同じ流れで実行する可能性がある作業で使います。

## Parameters

- **task_name** (required): SOP 化する作業名。
- **target_files** (optional): 作業に関係するファイルやディレクトリ。
- **tooling** (optional): 必要なコマンド、サービス、外部ツール。
- **risk_level** (optional): 失敗時の影響度。低 / 中 / 高。

## Prerequisites

- `AGENTS.md` の SOP 自動作成ルールを確認する。
- 既存の `sops/` に重複する SOP がないか確認する。
- 作業の実態がまだ固まっていない場合は、正式 SOP ではなくメモに留める。

## Steps

### 1. SOP 化する価値を判断する

対象作業が以下に当てはまるか確認する。

- 次回も同じ手順で実行しそう。
- 手順を間違えると影響が大きい。
- 複数ステップの確認・実行・検証が必要。
- 他の AI エージェントや開発者にも同じ手順を守ってほしい。

**Constraints:**

- MUST 1 回限りの軽微な修正だけなら SOP を作らない。
- SHOULD 既存 SOP で足りる場合は新規作成ではなく既存 SOP を更新する。

### 2. 配置とファイル名を決める

既存の置き場所があればそれに合わせる。
なければ `sops/` を作成し、`kebab-case` の `task-name.sop.md` として保存する。

**Constraints:**

- MUST ファイル拡張子は `.sop.md` にする。
- MUST ファイル名は作業内容が分かる名前にする。
- SHOULD SOP はすべて `sops/` に置く（このリポジトリでは `docs/` はサイト本体のため使わない）。

### 3. 必須セクションを書く

以下の構成で作成する。

```text
# 作業名

## Overview
何を、いつ、なぜ実行する手順か。

## Parameters
作業ごとに変わる入力値、対象ファイル、環境、URL など。

## Prerequisites
必要な権限、ツール、事前確認。

## Steps
実行手順。

## Verification
成功確認の方法。

## Rollback / Recovery
失敗時の戻し方、復旧方法、注意点。

## Related Files
関連するコード、設定、ドキュメント。
```

**Constraints:**

- MUST 手順は実行順に書く。
- MUST 重要な制約は `MUST` / `SHOULD` / `MAY` を使って明確にする。
- MUST 「何をするか」だけでなく「成功確認」を書く。
- SHOULD 失敗時に戻せる作業では `Rollback / Recovery` を具体化する。

### 4. AGENTS.md との整合性を確認する

SOP の内容が `AGENTS.md`、`DESIGN.md`、README、既存 docs と矛盾していないか確認する。

**Constraints:**

- MUST 古い手順や存在しないコマンドを書かない。
- MUST 関連するドキュメント側に更新が必要なら同時に更新する。

### 5. 作業完了時に報告する

作成・更新した SOP のパスを、作業完了時のまとめに含める。

**Constraints:**

- MUST SOP を作成した理由を 1 行で説明できる状態にする。
- SHOULD 未確認の手順が残る場合は、未確認であることを SOP または完了報告に明記する。

## Verification

- `*.sop.md` のファイル名になっている。
- 必須セクションが揃っている。
- 作業手順、成功確認、失敗時対応が分かる。
- 既存 SOP と重複していない。
- `AGENTS.md` や関連 docs と矛盾していない。

## Rollback / Recovery

- 誤って作成した SOP は削除する。
- 重複していた場合は、内容を既存 SOP に統合してから新規ファイルを削除する。
- 間違った手順を書いた場合は、実態に合わせて修正し、古い情報を残さない。

## Related Files

- `AGENTS.md`
- `DESIGN.md`
- `sops/`
