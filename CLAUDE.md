# CLAUDE.md — iKnoWay Personal Site

このファイルは Claude Code がこのリポジトリで作業する際の指針を定めたものです。

---

## プロジェクト概要

iKnoWay の個人ポートフォリオサイト。
アクセスするたびに **テーマがランダムで切り替わる** 仕組みを持ち、現在 2 つのテーマが実装されています。

| テーマ | コンセプト |
|---|---|
| `classy` | スターバックス風。ダークグリーン×ウォームクリーム×木目×黒板テクスチャ |
| `anime` | サイバーパンク・アニメ風。漆黒×ネオン×グリッチ×canvas パーティクル |

---

## ディレクトリ構成

```
/site
├─ index.html         エントリーポイント（ローダー画面）
├─ router.js          テーマ選択ロジック（重み付きランダム）
│
├─ themes/
│   ├─ classy/        おしゃれ系テーマ
│   │   ├─ index.html
│   │   ├─ style.css
│   │   └─ script.js
│   │
│   ├─ anime/         サイバーパンクアニメ系テーマ
│   │   ├─ index.html
│   │   ├─ style.css
│   │   └─ script.js
│   │
│   └─ future-theme/  追加テーマ用（未実装）
│
├─ assets/
│   ├─ images/        プロフィール画像など
│   ├─ fonts/         ローカルフォント（任意）
│   └─ sounds/        サウンドエフェクト（任意）
│
└─ shared/
    ├─ analytics.js   アナリティクス（プライバシー配慮型スタブ）
    └─ utils.js       全テーマ共通ユーティリティ
```

---

## テーマ追加の手順

1. `site/themes/` に新しいディレクトリを作成する
2. `index.html` / `style.css` / `script.js` を実装する
3. `site/router.js` の `THEMES` 配列にエントリを追加する

```js
// router.js
const THEMES = [
  { id: 'classy',       path: 'themes/classy/index.html',       weight: 1 },
  { id: 'anime',        path: 'themes/anime/index.html',        weight: 1 },
  { id: 'future-theme', path: 'themes/future-theme/index.html', weight: 1 }, // ← 追加
];
```

`weight` の値で表示確率を調整できます（大きいほど頻度が上がる）。

---

## テーマ切替の仕組み

| 方法 | URL / 操作 |
|---|---|
| ランダム（通常） | `site/index.html` にアクセス |
| 強制切替（別テーマ） | `site/index.html?switch=1` |
| 開発用（固定） | `site/index.html?theme=classy` または `?theme=anime` |

セッション中は `sessionStorage` でテーマを保持するので、リロードしても同じテーマが表示されます。
`?switch=1` を使うと現在のテーマとは**必ず異なる**テーマが選ばれます。

---

## 共通資産の使い方

### shared/utils.js

全テーマで `window.__utils` としてアクセスできます。

```js
const { $, $$, debounce, throttle, lerp, clamp, copyToClipboard } = window.__utils;
```

### shared/analytics.js

`window.__analytics.send(eventName, props)` でカスタムイベントを送信できます。
デフォルトはコンソールへのログ出力（スタブ）。本番運用時は `CONFIG.endpoint` を設定してください。

---

## 各テーマの実装メモ

### classy テーマ

- **フォント**: Playfair Display（見出し）/ Lato（本文）/ Caveat（黒板テキスト）
- **カラー**: `--green-deep: #1e3932` / `--cream: #f8f2e3` / `--wood-warm: #a0714f`
- **ライト演出**: `radial-gradient` で窓から差し込む陽光を表現
- **木目**: CSS `repeating-linear-gradient` で疑似木目テクスチャ
- **黒板**: `.section-chalk` + SVG `feTurbulence` フィルタでチョーク質感

### anime テーマ

- **フォント**: Bebas Neue（見出し）/ Rajdhani（本文）/ Noto Sans JP（日本語）
- **カラー**: `--neon-blue: #00d4ff` / `--neon-pink: #ff0080` / `--neon-purple: #9b30ff`
- **Canvas パーティクル**: `#particle-canvas` にフルスクリーン描画。マウスで反発。
- **スキャンライン**: `.scanlines` を `position: fixed` で全画面に重ねる
- **グリッチ**: `.glitch` に `data-text` 属性を付与し `::before` / `::after` で色ずれ
- **クリックバースト**: `document.addEventListener('click')` で ⚡ などが放射状に飛ぶ

---

## パーソナル情報の更新

以下の箇所を実際の情報に書き換えてください。

| ファイル | 更新箇所 |
|---|---|
| `themes/classy/index.html` | メール・SNS リンク・プロジェクト内容・スキル |
| `themes/anime/index.html`  | メール・SNS リンク・プロジェクト内容・スキル |
| `assets/images/`           | プロフィール画像（`profile.jpg` などを配置してHTMLのコメントを解除） |

---

## README の更新ルール

**以下のタイミングで README.md も必ず更新すること。**

- 新しいテーマを追加・削除したとき
- サイトの構成（URL 構造・ファイル配置）を変えたとき
- デプロイ方法・環境変数・外部依存が変化したとき
- 大きな機能追加・ビジュアル変更があったとき

README は**外部の人間が初めて見るドキュメント**として書く。
CLAUDE.md は**Claude Code が内部的に参照する実装ガイド**として書く（重複可だが役割を分ける）。

---

## デプロイ

このサイトは純粋な静的ファイル（HTML / CSS / JS のみ）です。
`/site` ディレクトリをそのまま任意の静的ホスティングサービスに置けば動作します。

| サービス例 | 手順 |
|---|---|
| GitHub Pages | `docs/` フォルダを公開ディレクトリとして使用（後述） |
| Netlify / Vercel | リポジトリを接続してルートを `site/` に設定 |
| Cloudflare Pages | 同上 |

ビルドステップは不要です。

### GitHub Pages の構成（現在の設定）

このリポジトリは **GitHub Pages** でのホスティングを前提に、以下の構成をとっています。

- **公開ディレクトリ**: `/docs`（GitHub Pages の設定: Branch `main` / Folder `/docs`）
- **開発ディレクトリ**: `/site`（実際の編集はこちらで行う）
- **公開 URL**: `https://iknoway-home.github.io/my-website/`

> GitHub Pages は `docs/` という名前のフォルダのみを公開ディレクトリとして指定できるため、
> `site/` とは別に `docs/` を用意しています。

### サイト更新時の手順（重要）

`site/` を編集した後、**必ず `docs/` にも同期すること。**
同期を忘れると本番サイトに変更が反映されません。

```bash
# site/ の内容を docs/ に上書きコピー
cp -r site/. docs/

# まとめてコミット
git add site/ docs/
git commit -m "Update site and sync docs"
git push
```

#### 同期が必要なタイミング

- テーマの HTML / CSS / JS を変更したとき
- `router.js` を変更したとき
- `shared/` 以下を変更したとき
- `assets/` に画像などを追加したとき

---

## 開発上の注意

- バンドラー・フレームワーク不使用。素の HTML / CSS / JS で構成されています。
- `shared/*.js` のエクスポートは `window.__utils` / `window.__analytics` のグローバル変数経由です。
- `console.log` を本番コードに残さないこと。デバッグは `analytics.js` の `CONFIG.enabled` フラグで制御してください。
- 新しい CSS アニメーションを追加する際は `prefers-reduced-motion` を考慮すること（`window.__utils.prefersReducedMotion()` で確認可能）。
- テーマ間で共通の UI パーツ（アナリティクス・ユーティリティ以外）が生まれた場合は `shared/` に切り出す。
