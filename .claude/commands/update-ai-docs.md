---
description: AI 用ドキュメント（AGENTS.md / DESIGN.md / ai-docs/ / sops/）を棚卸しして更新する
---

`sops/update-ai-docs.sop.md` の手順に従って、AI 用ドキュメントの棚卸しを実行してください。

- まず `bash scripts/ai-docs-status.sh` で現状を確認する。
- 実態とずれたドキュメントだけを更新し、古い情報を残さない。
- 「未設定」は判明している情報で埋める（該当しない項目は「なし」と書く）。
