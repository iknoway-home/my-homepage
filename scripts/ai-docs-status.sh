#!/usr/bin/env bash
# AI 用ドキュメント（AGENTS.md / DESIGN.md / ai-docs/ / sops/）の鮮度チェック。
# このリポジトリでは docs/ は GitHub Pages のサイト本体（= コード側）なので対象外。
#
# 使い方:
#   bash scripts/ai-docs-status.sh          # 状態を表示（問題がなければ何も出力しない）
#   bash scripts/ai-docs-status.sh --check  # 棚卸しが必要なら exit 1（CI 用）
#
# 判定基準:
#   - ドキュメント最終更新以降のコード変更コミットが COMMIT_THRESHOLD 件以上
#   - ドキュメント最終更新から DAY_THRESHOLD 日以上経過
#   - どちらかに該当したら「棚卸し推奨」と判定する
#
# このスクリプトは .claude/settings.json の SessionStart フックから毎セッション実行され、
# 出力がそのまま AI エージェントのコンテキストに入る。出力は短く保つこと。
set -u

COMMIT_THRESHOLD=5
DAY_THRESHOLD=30

MODE="${1:-}"
cd "$(dirname "$0")/.." || exit 0

stale=0
lines=""

append() {
  if [ -z "$lines" ]; then lines="$1"; else lines="$lines
$1"; fi
}

if git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
  && git rev-parse --verify HEAD >/dev/null 2>&1; then
  last_ts="$(git log -1 --format=%ct -- AGENTS.md CLAUDE.md DESIGN.md ai-docs sops 2>/dev/null || true)"
  if [ -n "$last_ts" ]; then
    now="$(date +%s)"
    days=$(( (now - last_ts) / 86400 ))
    code_commits="$(git rev-list --count HEAD --since="@${last_ts}" -- . \
      ':(exclude)AGENTS.md' ':(exclude)CLAUDE.md' ':(exclude)DESIGN.md' \
      ':(exclude)ai-docs' ':(exclude)sops' 2>/dev/null || echo 0)"
    if [ "${code_commits:-0}" -ge "$COMMIT_THRESHOLD" ] || [ "$days" -ge "$DAY_THRESHOLD" ]; then
      stale=1
      append "[ai-docs] AI 用ドキュメントの最終更新から ${days} 日、その後のコード変更コミットが ${code_commits} 件あります。"
    fi
  else
    stale=1
    append "[ai-docs] AI 用ドキュメントがまだ一度もコミットされていません。"
  fi
fi

placeholder_count="$(grep -rl "未設定" AGENTS.md DESIGN.md ai-docs sops 2>/dev/null | wc -l | tr -d ' ')"
if [ "${placeholder_count:-0}" -gt 0 ]; then
  append "[ai-docs] ${placeholder_count} ファイルに「未設定」プレースホルダが残っています。このセッションで判明した情報があれば、作業の締めくくりで埋めてください（該当しない項目は「なし」と書く）。"
fi

if [ "$stale" -eq 1 ]; then
  append "[ai-docs] 作業の区切りで sops/update-ai-docs.sop.md に従って棚卸しを実行してください（Claude Code では /update-ai-docs）。"
fi

if [ -n "$lines" ]; then
  printf '%s\n' "$lines"
fi

if [ "$MODE" = "--check" ] && [ "$stale" -eq 1 ]; then
  exit 1
fi
exit 0
