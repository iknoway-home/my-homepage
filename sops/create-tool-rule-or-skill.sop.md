# Tool Rule / Skill を作成・更新する

## Overview

AI ツール固有の rules、再利用可能な skill、または Claude Code の subagent を作成・更新するための手順です。
まず `AGENTS.md`、`ai-docs/`、`sops/` で足りるか判断し、足りない場合だけ切り出します。

## Parameters

- **need** (required): 何を自動化・固定化したいか。
- **target_tool** (optional): Cursor、GitHub Copilot、Claude、Codex など。
- **reuse_scope** (optional): 1 リポジトリ内 / 複数リポジトリ横断。
- **source_docs** (optional): 元になる `AGENTS.md`、docs、SOP。

## Prerequisites

- `AGENTS.md` の Rules / Skills 自動作成ルールを確認する。
- 既存の rules、skills、SOP と重複していないか確認する。
- プロジェクト固有の事実は、まず `ai-docs/` に置く。

## Steps

### 1. SOP / rules / skill のどれにするか判断する

| 種類 | 適した用途 |
|---|---|
| SOP | 作業手順、確認方法、復旧方法を残す |
| rules | 特定 AI ツールに常時守らせたい短い制約を書く |
| skill | 複数リポジトリで再利用する専門ワークフローや資料をまとめる |
| subagent（Claude Code） | 独立コンテキストで動かす定型の役割を定義する（`.claude/agents/*.md`） |

**Constraints:**

- MUST `AGENTS.md` や既存 SOP で足りるなら新規 rules / skill を作らない。
- MUST 同じ内容を複数ツール用ファイルに長文で重複させない。
- SHOULD rules は入口と制約だけにし、詳細は `AGENTS.md`、`ai-docs/`、`sops/` へリンクする。

### 2. rules を作る場合

対象ツールの規約に合わせて作成する。

| ツール | 置き場所の目安 | 用途 |
|---|---|---|
| Cursor | `.cursor/rules/*.mdc` | 常時適用する短いルール |
| Claude Code（パス限定） | `.claude/rules/*.md` | 特定パスを触るときだけ読ませるルール。frontmatter の `paths:`（glob）でスコープする。常時ルールは `AGENTS.md` に書く |
| GitHub Copilot | `.github/copilot-instructions.md` | Copilot Chat / 補完向けの入口 |
| Claude Code / Codex / Gemini CLI / Qwen Code | `AGENTS.md` 本体 | 全ツール共通ルール。各入口ファイルはリンクなので直接編集しない |

**Constraints:**

- MUST ルート方針は `AGENTS.md` を正とする。
- MUST `CLAUDE.md`、`GEMINI.md`、`QWEN.md` に直接書かない。`AGENTS.md` へのシンボリックリンクを実ファイル化すると一本化が壊れる。
- MUST rules には詳細を重複させすぎず、参照先を明記する。
- SHOULD 新しい rules を追加したら `README.md` または関連 docs に存在を記録する。

### 3. skill を作る場合

skill は、ツールが自動で発見・発動できる再利用単位として扱う。
なお Claude Code ではカスタムスラッシュコマンド（`.claude/commands/*.md`）と skill は同じ仕組みに統合されており、どちらも `/name` で呼び出せる。新規作成は付属資料を同梱できる skill 形式を優先する。
作成前に以下のいずれかを満たすか確認する。

- SOP が AI に参照されず、作業ミスや手戻りが実際に起きた（自動発動させたい）。
- 手順だけでなく、追加資料、スクリプト、テンプレート、判断基準をまとめる価値がある。
- 他リポジトリでも再利用できる。

置き場所は再利用範囲で決める。

| 再利用範囲 | 置き場所 | 備考 |
|---|---|---|
| このリポジトリ専用（Claude Code） | `.claude/skills/<name>/SKILL.md` | 対応する SOP がある場合は、SOP を参照する薄いスタブにする |
| このリポジトリ専用（Codex） | `.agents/skills/<name>/SKILL.md` | 同上。Agent Skills 標準形式 |
| 複数リポジトリ横断 | `~/.claude/skills/<name>/SKILL.md` などリポジトリ外の管理場所 | リポジトリにはコミットしない |

サードパーティ製 skill（例: herdr）を複数リポジトリで使う場合:

- ユーザーレベルに 1 回インストールすれば全リポジトリで有効になる。このテンプレートに同梱したり、リポジトリごとにコピーしたりしない。
- 公式 CLI: `npx skills add <owner/repo> --skill <name> -g`。更新は `npx skills update -g`。
- CLI を使わない場合は、公式リポジトリの `SKILL.md` を `~/.claude/skills/<name>/SKILL.md` に手動配置する。更新は同じ手順で上書きする。

`SKILL.md` の最低構成:

```markdown
---
name: task-name
description: いつ発動すべきかが分かる 1 行（自動発動の判断材料になる）
---

sops/task-name.sop.md の手順に従って実行してください。
```

**Constraints:**

- MUST 1 回限りの作業を skill 化しない。
- MUST 手順本体は `sops/*.sop.md` を正とし、リポジトリ内 skill は参照スタブに留める（二重管理を防ぐ）。
- MUST frontmatter に `name` と `description` を書く。`description` には発動条件を書く。
- SHOULD まず SOP として運用し、必要性が分かってから skill 化する。

### 4. subagent を作る場合（Claude Code）

メイン会話とは独立したコンテキストで動かしたい定型の役割（大量のファイルを読むレビュー、調査、監査など）がある場合に作成する。

`.claude/agents/<name>.md` に、frontmatter とシステムプロンプト本体を書く:

```markdown
---
name: code-reviewer
description: いつ委譲すべきかが分かる 1 行（自動委譲の判断材料になる）
tools: Read, Grep, Glob  # 省略すると全ツールを継承
---

役割と作業手順をシステムプロンプトとして書く。
```

**Constraints:**

- MUST `description` に発動条件を書く。Claude はこれを見て自動委譲するか判断する。
- SHOULD 読み取り専用の役割には `tools` を絞る。
- SHOULD 手順の詳細は SOP を正とし、subagent からは `sops/*.sop.md` を参照させる。

### 5. 関連ドキュメントを更新する

作成・更新した rules / skill が他の人や AI から見つかるようにする。

更新候補:

- `README.md`
- `AGENTS.md`
- `ai-docs/CODEMAP.md`
- `ai-docs/PROJECT.md`
- 関連する `sops/*.sop.md`

## Verification

- SOP / rules / skill の選択理由が説明できる。
- 既存 docs と重複しすぎていない。
- `AGENTS.md` を正として参照している。
- 対象ツールが読める場所と形式になっている。
- 作成・更新したファイルが README または docs から辿れる。

## Rollback / Recovery

- 不要な rules は削除し、必要な内容だけ `AGENTS.md` または SOP に戻す。
- 不要な skill は削除または下書き扱いに戻し、SOP として管理する。
- ツール固有ファイルが古くなった場合は、詳細を削って `AGENTS.md` 参照に戻す。

## Related Files

- `AGENTS.md`
- `README.md`
- `.cursor/rules/`
- `.claude/rules/`（作成した場合）
- `.github/copilot-instructions.md`
- `.claude/skills/`（作成した場合）
- `.claude/agents/`（作成した場合）
- `sops/create-or-update-sop.sop.md`
