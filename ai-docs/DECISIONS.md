# DECISIONS.md

このファイルは、重要な意思決定を軽量に残すためのログです。
後から「なぜこの設計にしたか」を確認できる状態にします。

## 自動更新ルール

以下のような判断をした場合は、このファイルに追記してください。

- 技術スタック、ライブラリ、外部サービスを選んだ。
- アーキテクチャやデータ構造を変えた。
- 既存方針とは違う実装を採用した。
- セキュリティ、運用、コスト、パフォーマンスに影響する判断をした。
- 「今はやらない」と決めた。

軽微な実装判断は記録不要です。

## 書き方

新しい判断は上に追加します。
日付は `YYYY-MM-DD` で書きます。

```text
## YYYY-MM-DD: 決定タイトル

- Status: Accepted / Superseded / Deprecated
- Context: 背景
- Decision: 決めたこと
- Consequences: 影響、トレードオフ
- Related: 関連ファイル、Issue、PR
```

## Decisions

## 2026-07-06: AI 用ドキュメントは docs/ ではなく ai-docs/ に置く

- Status: Accepted
- Context: 汎用テンプレートは AI 用ドキュメントを `docs/` に置く前提だが、このリポジトリでは `docs/` が GitHub Pages の公開ディレクトリ（サイト本体）。混ぜると内部ドキュメントが公開され、鮮度チェックスクリプトの判定（docs 配下の更新 = ドキュメント更新）も壊れる。
- Decision: AI 用ドキュメントはルートの `ai-docs/` に置き、テンプレート由来の全ファイル（AGENTS.md / sops / scripts / フック / CI）内の `docs/*.md` 参照を `ai-docs/*.md` に書き換えた。既存の `CLAUDE.md` の内容は `AGENTS.md`（作業ルール）・`DESIGN.md`（デザイン詳細）・`ai-docs/`（構成・運用）に統合し、`CLAUDE.md` は `AGENTS.md` へのシンボリックリンクにした。
- Consequences: テンプレートの標準配置と異なるため、テンプレート更新を取り込むときはパス読み替えが必要。`scripts/ai-docs-status.sh` は `docs/` をコード側として扱う。
- Related: `AGENTS.md`, `ai-docs/`, `scripts/ai-docs-status.sh`, `.claude/settings.json`, `.github/workflows/ai-docs-freshness.yml`

## 2026-07-05: rules / skills は基準を満たすときだけ作成する

- Status: Accepted（「公式プラクティス調査の反映範囲を決める」の skills 見送り判断を一部上書き）
- Context: rules / skills を全面禁止にすると、SOP が AI に参照されない事故が起きたときの対処手段がない。一方で無条件に許可すると濫造と二重管理が起きる。
- Decision: `AGENTS.md` の「Rules / Skills 自動作成ルール」と `sops/create-tool-rule-or-skill.sop.md` に判断基準を定め、基準を満たす場合だけ作成する。SOP を最優先とし、リポジトリ内 skill は SOP を参照する薄いスタブに限定する。手順本体の正は常に `sops/*.sop.md`。
- Consequences: 最初から skill ファイルは置かない。SOP 不参照の事故が起きたとき、または複数リポジトリ横断の再利用が必要になったときに初めて作る。`CLAUDE.md` / `GEMINI.md` / `QWEN.md` への直接書き込みは禁止（シンボリックリンク維持）。
- Related: `AGENTS.md`, `sops/create-tool-rule-or-skill.sop.md`, `sops/update-ai-docs.sop.md`, `README.md`

## 2026-07-05: 公式プラクティス調査の反映範囲を決める

- Status: Accepted
- Context: AGENTS.md 標準（agents.md、Linux Foundation 管轄）、Anthropic の Claude Code ベストプラクティス、OpenAI Codex、Qwen Code の公式ドキュメントを調査した。
- Decision: 採用 — (1) `QWEN.md` 入口リンクを追加（Qwen Code の既定コンテキストファイル）。(2) `.claude/settings.json` に鮮度チェックスクリプトの permissions 許可を追加。(3) Anthropic の「毎セッション読むファイルは短く保つ」指針に従い、AGENTS.md の「各フォルダの役割」を削除し「機能の置き場所」の汎用表を `ai-docs/CODEMAP.md` へ移動（三重記述の解消）。
- Consequences: 見送り — Agent Skills（`.claude/skills/`、`.agents/skills/`）は SOP + `/update-ai-docs` コマンドと役割が重複するため作らない（SOP が育って自動発動させたくなったら再検討）。`.mcp.json` は MCP を使い始めたら追加。`llms.txt` は公開ドキュメントサイト向けのためリポジトリには不要。`.github/instructions/*.instructions.md`（パス別 Copilot 指示）は単一ファイルで足りている間は不要。
- Related: `QWEN.md`, `.claude/settings.json`, `AGENTS.md`, `ai-docs/CODEMAP.md`

## 2026-07-05: 鮮度チェックを仕組みで自動化する

- Status: Accepted
- Context: 棚卸しのタイミングが「AI が覚えていたら実行する」という指示だけでは実行されないリスクが高い。
- Decision: `scripts/ai-docs-status.sh` で git 履歴から陳腐化を判定し、Claude Code の SessionStart フックと週 1 の GitHub Actions から自動実行する。追加候補ドキュメント（`ai-docs/API.md` など）は最初から置かず、条件を満たしたときに AI が自動作成する。
- Consequences: セッション開始時に短いリマインダーが入る。判定基準はスクリプト先頭の定数（コミット 5 件 / 30 日）で調整できる。GitHub を使わないリポジトリではワークフローを削除する。
- Related: `scripts/ai-docs-status.sh`, `.claude/settings.json`, `.claude/commands/update-ai-docs.md`, `.github/workflows/ai-docs-freshness.yml`, `AGENTS.md`

## 2026-07-05: AI 用ドキュメントを自動更新対象にする

- Status: Accepted
- Context: AI エージェントがプロジェクトの実態を把握しやすくし、同じ説明や探索を繰り返さないようにする。
- Decision: `AGENTS.md`、`DESIGN.md`、`ai-docs/`、`sops/` を、実装や運用変更に合わせて自動更新する対象にする。
- Consequences: 変更時に必要な文書更新が増える。一方で、長期的には探索コストと誤実装を減らせる。
- Related: `AGENTS.md`, `DESIGN.md`, `ai-docs/`, `sops/`
