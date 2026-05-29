# CLAUDE.md — iKnoWay Personal Site

このファイルは Claude Code がこのリポジトリで作業する際の指針を定めたものです。

---

## プロジェクト概要

iKnoWay の個人サイト。アニメと映画を愛するオタクのプロフィール・お気に入り作品を紹介する。
アクセスするたびに **テーマがランダムで切り替わる** 仕組みを持ち、現在 2 つのテーマが実装されている。

| テーマ | コンセプト |
|---|---|
| `classy` | スターバックス風。ダークグリーン×ウォームクリーム×木目×黒板テクスチャ |
| `anime` | サイバーパンク・アニメ風。漆黒×ネオン×グリッチ×canvas パーティクル |
| `data-js` | `shared/data.js` をそのまま表示するソースビュー |

---

## ディレクトリ構成

```
/docs                    GitHub Pages 公開ディレクトリ（開発もここで直接行う）
├─ index.html            エントリーポイント（ローダー画面）
├─ router.js             テーマ選択ロジック（重み付きランダム）
│
├─ themes/
│   ├─ classy/           おしゃれ系テーマ
│   │   ├─ index.html
│   │   ├─ style.css
│   │   └─ script.js
│   │
│   └─ anime/            サイバーパンクアニメ系テーマ
│       ├─ index.html
│       ├─ style.css
│       └─ script.js
│
└─ shared/
    ├─ data.js           全テーマ共通コンテンツデータ（プロフィール・ゲーム・アニメ・映画・成果物・連絡先）
    ├─ games.js          通常テーマ向けゲームセクション描画
    ├─ projects.js       通常テーマ向け成果物セクション描画
    └─ utils.js          全テーマ共通ユーティリティ
```

---

## コンテンツデータの仕組み

すべてのコンテンツ（プロフィール、ゲーム、お気に入りアニメ、お気に入り映画、成果物、連絡先）は
`shared/data.js` に `window.__data` として一元管理されている。

各テーマの `script.js` がページ読み込み時に `window.__data` からデータを読み取り、
テーマ固有のHTMLを動的に生成する。**コンテンツを更新するときは `shared/data.js` だけを編集すればよい。**

```js
// data.js の構造
window.__data = {
  profile: { name, role, tagline, about, facts, traits },
  heroStats: [ { count, unit, label } ],
  games: [ { title, status, comment, tags } ],
  anime: [ { title, comment, tags } ],
  movies: [ { title, comment, tags } ],
  projects: [ { name, url, description, tags } ],
  contact: { message, email },
  social: [ { name, url } ]
};
```

---

## テーマ追加の手順

1. `docs/themes/` に新しいディレクトリを作成する
2. `index.html` / `style.css` / `script.js` を実装する
3. `script.js` 内で `window.__data` を読み取ってコンテンツを描画するレンダリング関数を実装する
4. `docs/router.js` の `THEMES` 配列にエントリを追加する

```js
// router.js
const THEMES = [
  { id: 'classy',       path: 'themes/classy/index.html',       weight: 1 },
  { id: 'anime',        path: 'themes/anime/index.html',        weight: 1 },
  { id: 'future-theme', path: 'themes/future-theme/index.html', weight: 1 }, // <- 追加
];
```

`weight` の値で表示確率を調整できます（大きいほど頻度が上がる）。

---

## テーマ切替の仕組み

| 方法 | URL / 操作 |
|---|---|
| ランダム（通常） | `docs/index.html` にアクセス |
| 強制切替（別テーマ） | `docs/index.html?switch=1` |
| 開発用（固定） | `docs/index.html?theme=classy` または `?theme=anime` |

セッション中は `sessionStorage` でテーマを保持するので、リロードしても同じテーマが表示されます。
`?switch=1` を使うと現在のテーマとは**必ず異なる**テーマが選ばれます。

---

## 共通資産の使い方

### shared/data.js

全テーマで `window.__data` としてアクセスできます。コンテンツの変更はこのファイルのみで行う。

### shared/utils.js

全テーマで `window.__utils` としてアクセスできます。

```js
const { $, $$, debounce, throttle, lerp, clamp, copyToClipboard } = window.__utils;
```

### shared/human-polish.css

全テーマで `style.css` の後に読み込む共通仕上げレイヤーです。
ヘッダーと共通操作ボタンの **位置・サイズ・ヒットエリア** はここで固定し、各テーマの `style.css` では色、角丸、影、ボーダー、ホバー演出だけを調整します。

新規テーマでは、通常ナビゲーションに `site-header` / `nav-inner` / `nav-logo` / `nav-links` / `nav-switch` を使うこと。
特殊ナビゲーションの場合は `book-header` / `chapter-nav` / `theme-switch` を使うと共通寸法が適用されます。
寸法を変える必要がある場合は、テーマごとに上書きせず `docs/shared/human-polish.css` の `--chrome-*` 変数を更新してください。

### shared/games.js

通常テーマでは `shared/data.js` の後、`shared/projects.js` の前に読み込むこと。
`window.__data.games` からAnimeの直前にゲームセクションを自動挿入します。
`fantasy-book` のような特殊構造テーマでは、テーマ固有の `script.js` で `data.games` を独立ページとして描画してください。

### shared/projects.js

通常テーマでは `shared/data.js` の後、`shared/snap.js` の前に読み込むこと。
`window.__data.projects` からContactとは別の成果物セクションを自動挿入します。
`fantasy-book` のような特殊構造テーマでは、テーマ固有の `script.js` で `data.projects` を独立ページとして描画してください。

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
- **クリックバースト**: `document.addEventListener('click')` で 符号などが放射状に飛ぶ

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
`/docs` ディレクトリをそのまま任意の静的ホスティングサービスに置けば動作します。

### GitHub Pages の構成（現在の設定）

- **公開ディレクトリ**: `/docs`（GitHub Pages の設定: Branch `main` / Folder `/docs`）
- **開発ディレクトリ**: `/docs`（公開ディレクトリと同一。同期不要）
- **公開 URL**: `https://iknoway-home.github.io/my-website/`

ビルドステップは不要です。`docs/` を編集してプッシュすればそのまま反映されます。

---

## 2026 UI/UX トレンドガイドライン

調査した主要トレンドのうち、このサイト（静的・バンドラーなし・テーマ切替ポートフォリオ）に直接適用できるものをまとめる。
新テーマの制作・既存テーマの改善時に参照すること。

### 採用すべきトレンド

#### 1. マイクロインタラクション（最優先）
> 「静的に見えるものは古さを感じさせる」— ホバー・フォーカス・スクロール・クリックに必ず小さな動きを

- ボタン: `transform: scale` + `box-shadow` の変化（`transition: 200ms ease`）
- リンク: アンダーラインが左から右にスライドするアニメ（`::after` + `scaleX`）
- カード: ホバー時に `translateY(-4px)` + 影が深くなる
- `anime` テーマのクリックバーストは既に実装済み — 他テーマにも独自バーストを追加する

```css
/* 例: ボタン共通マイクロインタラクション */
.btn { transition: transform 200ms ease, box-shadow 200ms ease; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.2); }
.btn:active { transform: translateY(0); }
```

#### 2. 表現的タイポグラフィ
> タイトルは「見出し」ではなく「ビジュアル要素」として扱う

- 見出しのフォントサイズは `clamp()` でレスポンシブに（`clamp(2.5rem, 8vw, 7rem)`）
- 大きな見出しに `letter-spacing: -0.03em` でモダンな詰まり感
- キーワードに `background-clip: text` グラデーションを使った色付き文字
- スクロールトリガーで文字が1文字ずつ / 1行ずつ現れるアニメーション（`IntersectionObserver` 活用）

#### 3. ベントグリッドレイアウト
> アニメ・映画セクションをカード型グリッドで整理する

- CSS Grid の `grid-template-areas` で大小混在のカードレイアウト
- カード角丸: `border-radius: 16px〜24px`（角が大きいほどモダン）
- 各カードにサイズバリエーション（1×1 / 2×1 / 1×2）を持たせて視覚的リズムを作る

```css
/* 例: ベントグリッドの骨格 */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.bento-card-wide { grid-column: span 2; }
.bento-card-tall { grid-row: span 2; }
```

#### 4. ドーパミンデザイン（カラー）
> 鮮やかで高コントラストな配色で「見ていて気持ちいい」を優先

- `anime` テーマ: 既に実装済み。グラデーションを `conic-gradient` に拡張するとさらに鮮やか
- 新テーマ: ネオングリーン系、ホットピンク×ブラック系などを検討
- ホバー時に背景色が `hsl` で色相がシフトするアニメーション（`filter: hue-rotate()`）

#### 5. スクロール連動アニメーション
> `IntersectionObserver` で要素が入るたびに演出を発火（既存の `utils.js` 活用）

- セクション全体: `opacity: 0 → 1` + `translateY(30px → 0)`（`stagger` で子要素を順次フェードイン）
- 数字カウントアップ: 実績数値などを入場時にアニメーションカウント

```js
// 例: stagger フェードイン
const items = $$('.card-item');
observer.observe(items, (el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
  el.classList.add('visible');
});
```

#### 6. アクセシビリティ（インクルーシブデザイン）
> アクセシビリティはコンプライアンスではなくUXの一部

- すべてのインタラクティブ要素に `:focus-visible` スタイルを明示（`outline: 2px solid currentColor`）
- アニメーションは必ず `prefers-reduced-motion` で制御（`window.__utils.prefersReducedMotion()` 使用）
- カラーコントラスト比: テキストは WCAG AA 基準（4.5:1）以上を確認
- `aria-label` / `role` / `alt` を全画像・アイコンに付与

#### 7. サステナブルなWebデザイン
> 軽量・高速を美徳にする

- 画像は WebP 形式を優先（`<picture>` + `srcset`）
- フォントは使うウェイトのみ `font-display: swap` でロード
- アニメーションは `transform` / `opacity` のみ使用（`width` / `height` の変化はリフローを起こすため避ける）
- 未使用 CSS は各テーマに閉じ込め、グローバルに漏らさない

---

### 採用しないトレンド（このサイトのスコープ外）

| トレンド | 理由 |
|---|---|
| AI 駆動 UI | バックエンドなし・静的ファイルのみのため |
| 音声 / マルチモーダル | サイトの目的と合わない |
| AR / VR / WebXR | 実装コストに対して効果が薄い |
| アジェンティック UX | エージェント操作の必要がない |

---

## 開発上の注意

- バンドラー・フレームワーク不使用。素の HTML / CSS / JS で構成されています。
- `shared/*.js` のエクスポートは `window.__utils` / `window.__data` のグローバル変数経由です。
- `console.log` を本番コードに残さないこと。
- 新しい CSS アニメーションを追加する際は `prefers-reduced-motion` を考慮すること（`window.__utils.prefersReducedMotion()` で確認可能）。
- テーマ間で共通の UI パーツ（ユーティリティ・データ以外）が生まれた場合は `shared/` に切り出す。
