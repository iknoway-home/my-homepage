# 機能を追加・変更する

## Overview

既存の設計と配置を崩さず、機能を追加・変更するための標準手順です。

## Parameters

- **feature_name** (required): 追加・変更する機能名。
- **entry_point** (optional): 画面、API、コマンドなどの入口。
- **risk_level** (optional): 低 / 中 / 高。

## Prerequisites

- `AGENTS.md` を確認する。
- `ai-docs/CODEMAP.md` で類似機能の置き場所を確認する。
- UI 変更がある場合は `DESIGN.md` を確認する。
- 環境変数や外部サービスが関係する場合は `ai-docs/ENVIRONMENT.md` を確認する。

## Steps

### 1. 既存の同種機能を探す

```bash
rg "<feature name or related keyword>"
```

**Constraints:**

- MUST 既存の配置、命名、設計を優先する。
- MUST 無関係なリファクタリングを混ぜない。

### 2. 変更範囲を決める

実装、テスト、ドキュメントの更新範囲を決める。

### 3. ファイル分割の境界を決める

新規実装や大きめの機能追加では、単一ファイルにすべてを詰め込まず、必要に応じて機能単位で分割する。
ただし、過剰分割は避け、変更理由と責務が自然に分かれる単位だけを切り出す。

**Constraints:**

- SHOULD 同じ機能に関する UI、状態・ユースケース、API / 永続化、型、入力検証、テストを近い場所に置く。
- SHOULD UI、状態管理、API 通信、型定義、バリデーションが混ざる場合は、責務ごとに分ける。
- SHOULD 1 ファイルが 300〜500 行程度を超える、または複数の理由で変更される場合は分割を検討する。
- MUST 5〜20 行程度の小さな関数や、その機能でしか使わない薄いラッパーを理由なく単独ファイル化しない。
- MUST 将来使いそうという理由だけで `shared/`、`lib/`、`components/` に先回りして共通化しない。
- MUST フレームワークや既存プロジェクトの配置規約がある場合は、それを優先する。

### 4. 最小単位で実装する

既存パターンに合わせて実装する。
新しい依存や抽象化は、必要性が明確な場合だけ追加する。

### 5. 確認する

`ai-docs/TESTING.md` の関連コマンドと手動確認を実行する。

### 6. AI 用ドキュメントを更新する

必要に応じて以下を更新する。

- `ai-docs/CODEMAP.md`: 機能の入口や置き場所が変わった場合。
- `ai-docs/ARCHITECTURE.md`: 境界やデータフローが変わった場合。
- `DESIGN.md`: UI 方針やコンポーネントが変わった場合。
- `ai-docs/ENVIRONMENT.md`: 環境変数や外部サービスが変わった場合。
- `ai-docs/DECISIONS.md`: 重要な判断をした場合。
- `sops/*.sop.md`: 再利用する手順が生まれた場合。

## Verification

- 機能が期待通り動く。
- 関連テスト、lint、ビルド、手動確認が済んでいる。
- 変更した機能の置き場所が `ai-docs/CODEMAP.md` と矛盾していない。
- 必要なドキュメント更新が完了している。

## Rollback / Recovery

- 実装を戻す必要がある場合は、変更ファイルを確認して関連差分だけ戻す。
- 新しく追加した設定や環境変数が不要になった場合は、docs と `.env.example` からも削除する。

## Related Files

- `AGENTS.md`
- `DESIGN.md`
- `ai-docs/CODEMAP.md`
- `ai-docs/ARCHITECTURE.md`
- `ai-docs/TESTING.md`
