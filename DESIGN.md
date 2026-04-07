# design.md — iKnoWay Personal Site デザインドキュメント

このファイルはサイト全体のデザイン方針・実装済みテーマの詳細・最新技術トレンド調査結果をまとめたものです。
新テーマの制作・既存テーマの改修・デザインの意思決定に参照してください。

---

## デザイン哲学

このサイトの核心は **「同一コンテンツ × 複数のビジュアル体験」** という思想にある。
アクセスするたびにテーマがランダムで切り替わることで、サイト自体がひとつの「ガチャ体験」になっている。

- コンテンツは `shared/data.js` に一元管理 → テーマはビジュアルだけに集中できる
- 純粋な HTML / CSS / JS（バンドラー・フレームワーク不使用）→ シンプルさが持続可能性を生む
- 各テーマは独立した世界観を持ち、互いに干渉しない

---

## 実装済みテーマ詳細

### classy テーマ

**コンセプト**: スターバックス風カフェ。ダークグリーン×ウォームクリーム×木目×黒板。

#### カラーパレット

| 変数名 | 値 | 用途 |
|--------|-----|------|
| `--green-deep` | `#1e3932` | ヒーロー壁・ヘッダー |
| `--green-mid` | `#2d5a47` | カード背景・アクセント |
| `--cream` | `#f8f2e3` | メイン背景 |
| `--cream-dark` | `#efe8d5` | セクション交互背景 |
| `--wood-warm` | `#a0714f` | 木目・ボーダー |
| `--wood-dark` | `#6b3a2a` | 濃い木目 |
| `--gold` | `#b8860b` → `#d4a830` | アクセント・ホバー |
| `--text-dark` | `#1a1208` | 本文テキスト |

#### フォント

| 役割 | フォント | 特徴 |
|------|---------|------|
| 見出し | Playfair Display | セリフ・エレガント |
| 本文 | Lato | 読みやすいサンセリフ |
| チョーク装飾 | Caveat | 手書き風 |

#### レイアウト
- **スクロールスナップ**: フルビューポートセクションを `scroll-snap-type: y mandatory` でスナップ
- **木目テクスチャ床**: `repeating-linear-gradient` を 88°方向に重ねてフローリング表現
- **窓光演出**: `radial-gradient` で右上から差し込む陽光を再現
- **黒板セクション**: SVG `feTurbulence` フィルタ + ダッシュボーダーでチョーク質感
- **アバウトグリッド**: `1fr / 1.7fr` 2カラム、画像に木製フレーム風コーナー装飾

#### アニメーション・インタラクション

| 演出 | 手法 |
|------|------|
| 光の揺らぎ（bokeh） | `@keyframes lightSway` 8s infinite（radial-gradient 位置変化） |
| リンク下線スライド | `::after` の `scaleX: 0→1`（cubic-bezier 0.4s） |
| ボタンホバー | アウトライン → ゴールドfill + shadow（0.3s） |
| スクロール reveal | `translateY(22px)→0` + opacity（0.75s ease） |
| スクロールプロンプト | シェブロンが上下バウンス（2.5s infinite） |

---

### anime テーマ

**コンセプト**: 明るいマンガ・アニメ風。桜ピンク×空色×きらきら。

#### カラーパレット

| 変数名 | 値 | 用途 |
|--------|-----|------|
| `--sakura` | `#FF6B9D` | メインアクセント |
| `--sky` | `#7EC8E3` | サブアクセント |
| `--gold` | `#FFD700` | 強調・スター |
| `--orange` | `#FF9F43` | グラデーション補色 |
| `--bg` | `#FFFBFC` | メイン背景 |
| `--bg-alt` | `#FFF5F8` | 交互セクション |
| `--text` | `#2D3D36` | 本文テキスト |

#### フォント

| 役割 | フォント | 特徴 |
|------|---------|------|
| 見出し | M PLUS Rounded 1c / Zen Maru Gothic | 太い丸ゴシック・インパクト |
| 本文 | Noto Sans JP | 読みやすい日本語サンセリフ |

#### レイアウト
- **カードグリッド**: `repeat(auto-fill, minmax(280px, 1fr))` でレスポンシブ
- **スピーチバブル**: コンタクトセクションを吹き出し型カードで表現（`::before` の三角形）
- **ヒーローステータス**: 数値をセンタリング表示、区切り線でリズム

#### アニメーション・インタラクション

| 演出 | 手法 |
|------|------|
| グラデーションテキスト | `background-clip: text` + ピンク→ブルーグラデ |
| 星フロート | `rotate + translateY(-12px)` 各種 delay でランダム感 |
| リンク下線 | 3px グラデーション線が左からスライド（0.4s） |
| カードホバー | `translateY(-4px)` + shadow-lg + ボーダーグロー |
| キャンバスパーティクル | Canvas API でスパークル演出（固定・フルスクリーン） |
| スクロール reveal | `translateY(24px)→0` + opacity（0.6s） |

---

### cyber テーマ

**コンセプト**: サイバーパンク / 未来的ネオン。漆黒×ネオン×グリッチ×ターミナル。

#### カラーパレット

| 変数名 | 値 | 用途 |
|--------|-----|------|
| `--bg` | `#05050f` | メイン背景（ほぼ黒） |
| `--panel` | `#0a0a1e` | カード・パネル背景 |
| `--neon-blue` | `#00d4ff` | メインネオン |
| `--neon-pink` | `#ff0080` | ホットピンクアクセント |
| `--neon-purple` | `#9b30ff` | パープルアクセント |
| `--neon-green` | `#00ff88` | ターミナル・緑 |
| `--neon-yellow` | `#ffe600` | 警告・強調 |
| `--text` | `#e8e8ff` | 本文（薄いパープル白） |
| `--muted` | `#7878aa` | 補助テキスト |

#### フォント

| 役割 | フォント | 特徴 |
|------|---------|------|
| 見出し | Bebas Neue / Impact | 幅広・力強い等幅風 |
| 本文 | Rajdhani | テック感のあるサンセリフ |
| 日本語 | Noto Sans JP | クリーンな日本語 |

#### レイアウト
- **ヒーロー**: 2カラムグリッド（左テキスト | 右オーラビジュアル）
- **プロフィールカード**: IDカード風（カラートップボーダー、アバターサークル）
- **電力ゲージ**: スキルを `gradient fill + flicker` バーで視覚化
- **ワークカード**: 左上に斜めスラッシュアクセント、ボトムエッジグロー
- **ターミナル風コンタクト**: ドット3つ + モノスペースUIで端末感

#### アニメーション・インタラクション

| 演出 | 手法 |
|------|------|
| グリッチテキスト | `::before`/`::after` + `clip-path` でRGBずれ（6sサイクル） |
| オーラリング | 拡散する同心円（3s ease-out、cascading delays） |
| スピードライン | `radial conic-gradient` アニメーション |
| スキャンバー | ヘッダー底部をグラデーション線が水平に走る |
| スキャンライン | `position: fixed` の全画面横線オーバーレイ（3px間隔） |
| ナビリンクホバー | 背景が左からfill（0.25s） + ネオングロー |
| ボタン | `clip-path` 12px 面取りコーナー + シャイン |
| 電力ゲージfill | `cubic-bezier` アニメ + 50% で flicker |
| カードグロー | ボトムエッジが `scaleX 0→1` で発光 |
| ターミナルカーソル | ブリンクするブロック文字 |
| Canvasパーティクル | 背景アニメーション粒子 |

---

## 共通技術基盤

### データ管理 — `shared/data.js`

全テーマで `window.__data` としてアクセス。コンテンツはここだけ編集すればよい。

```js
window.__data = {
  profile: { name, role, roleJp, tagline, about, facts, traits },
  heroStats: [{ count, unit, label }],
  anime:  [{ title, comment, tags }],   // 9件
  movies: [{ title, comment, tags }],   // 6件
  contact: { message, email },
  social: [{ name, url, icon }]         // SVGインラインアイコン
};
```

### ユーティリティ — `shared/utils.js`

全テーマで `window.__utils` としてアクセス。

| 関数 | 用途 |
|------|------|
| `$(sel, ctx)` | `querySelector` ショートハンド |
| `$$(sel, ctx)` | `querySelectorAll` → Array |
| `lerp(a, b, t)` | 線形補間 |
| `clamp(v, min, max)` | クランプ |
| `mapRange(v, i0, i1, o0, o1)` | 値域変換 |
| `throttle(fn, ms)` | スロットル |
| `debounce(fn, ms)` | デバウンス |
| `getLocal(key)` | `localStorage.getItem`（try-catch付） |
| `setLocal(key, val)` | `localStorage.setItem`（try-catch付） |
| `trapFocus(el)` | モーダル内Tabサイクル |
| `copyToClipboard(text)` | クリップボードコピー → `Promise<boolean>` |
| `prefersReducedMotion()` | ユーザーのモーション設定を取得 |

### スクロールアニメーション共通パターン

```js
// IntersectionObserver + .reveal クラス
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

$$('.reveal').forEach(el => observer.observe(el));
```

```css
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { transition: none; } }
```

---

## 最新デザイン・技術トレンド調査（2025-2026）

調査対象：個人サイト、ポートフォリオサイト、Awwwards / Muzli 受賞作、Chrome Developer Blog

---

### ビジュアル・美的トレンド

| トレンド | 概要 | このサイトへの適用 |
|---------|------|-----------------|
| ソフトミニマリズム×有機的シェイプ | 直線グリッドを脱し、流線・ブロブ・ソフトグラデへ | classy テーマにブロブ型デコ要素を追加 |
| ドーパミンデザイン | 高彩度・高コントラスト・Y2K パターン | cyber / anime テーマは既に近い方向性 |
| マキシマリスト表現的タイポグラフィ | 極大見出し（`clamp(4rem, 12vw, 10rem)`）× 極小テキストの対比 | 全テーマの H1 をより大きく |
| ベントグリッドレイアウト | 大小混在カード（1×1 / 2×1 / 1×2）による視覚リズム | アニメ・映画セクションに適用しやすい |
| ノイズ・グレインテクスチャ | CSS / SVG フィルタで紙・フィルム質感 | classy 黒板は実装済み、他テーマへ拡張余地あり |

---

### インタラクション・モーション

| トレンド | 概要 | 静的サイト適用可否 |
|---------|------|-----------------|
| マイクロインタラクション強化 | ホバー・フォーカス・クリックごとに細かなフィードバック | ✅ CSS のみで対応可 |
| スクロール駆動アニメーション（CSS Scroll-Driven Animations） | スクロール位置に連動するアニメーションを CSS ネイティブで実現 | ✅ ライブラリ不要 |
| View Transitions API | ページ・状態遷移をシームレスなアニメーションで演出 | ✅ Vanilla JS API |
| GSAP ScrollTrigger / SplitText | 高品質スクロールアニメ・文字単位アニメ | ✅ CDN で導入可能 |
| 3D スクロールアニメーション（Three.js） | DOM と WebGL を同期させた没入型スクロール体験 | ⚠️ CDN 導入は可能、実装コスト高 |
| WebGL カスタムシェーダー | スクロールやホバーで画像が変形・歪む演出 | ⚠️ 実装コスト高 |

---

### 注目ブラウザ API（静的サイト向け）

#### View Transitions API ⭐ 最優先
- **Baseline 2025 達成**（Chrome / Firefox / Safari クロスブラウザ対応）
- ページ遷移・状態変化を `document.startViewTransition()` で囲むだけでアニメーション付与
- **このサイトへの適用**: `router.js` のテーマ切替（現在の `setTimeout + window.location.replace`）を置換すると格段に滑らかになる

```js
// 現在
setTimeout(() => window.location.replace(theme.path), 400);

// View Transitions API を使った場合
document.startViewTransition(() => {
  window.location.replace(theme.path);
});
```

#### CSS Scroll-Driven Animations ⭐
- スクロール位置をアニメーションのタイムラインとして使う CSS ネイティブ機能
- `animation-timeline: scroll()` または `view()` で制御
- JavaScript 不要・IntersectionObserver を一部代替できる

```css
/* スクロール連動フェードイン */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: none; }
}
.reveal {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

#### Intersection Observer（既存実装済）
- 全テーマで `.reveal` クラスを使った入場アニメに活用中
- `rootMargin` / `threshold` の調整でさらに細かい制御が可能

#### CSS Scroll Snap（classy で実装済）
- `scroll-snap-type: y mandatory` でセクション単位のスナップ

---

### 参考リソース

| リソース | URL | 内容 |
|---------|-----|------|
| Muzli: Top 100 Portfolio 2025 | muz.li | 受賞ポートフォリオ一覧 |
| Awwwards | awwwards.com | 賞を受けたクリエイティブサイト |
| Colorlib: Portfolio Trends 2026 | colorlib.com/wp/portfolio-design-trends/ | トレンド解説記事 |
| Codrops | tympanus.net/codrops | CSS/JS テクニック実装例 |
| Chrome for Developers: View Transitions 2025 | developer.chrome.com/blog/view-transitions-in-2025 | API の最新状況 |
| MDN: View Transition API | developer.mozilla.org/docs/Web/API/View_Transition_API | リファレンス |
| CSS-Tricks: Scroll-Driven Animations | css-tricks.com | 実装ガイド |

---

## このサイトへの適用候補（優先度順）

### 1. View Transitions API — テーマ切替の滑らか化
**対象**: `docs/router.js`
現在の `setTimeout + window.location.replace` を `document.startViewTransition()` で包む。
ローダー画面のフェードと遷移アニメがブラウザネイティブに処理される。

### 2. CSS Scroll-Driven Animations — JS 削減
**対象**: 全テーマの `style.css`
`.reveal` の IntersectionObserver を `animation-timeline: view()` に段階的移行。
サポートブラウザ向けに `@supports` で条件分岐するとよい。

### 3. ベントグリッドレイアウト — カードセクションの刷新
**対象**: 全テーマのアニメ・映画セクション
`grid-template-areas` で大小バリエーション（wide / tall / standard）を持たせ、
単調なグリッドから視覚的リズムのあるレイアウトへ。

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.bento-wide { grid-column: span 2; }
.bento-tall { grid-row: span 2; }
```

### 4. 表現的タイポグラフィ強化 — 見出しをもっと大きく
**対象**: 全テーマの H1 / Hero タイトル
`clamp()` の上限値を上げ、`letter-spacing: -0.03em` でモダンな詰まり感を追加。

```css
/* Before */
font-size: clamp(2.5rem, 6vw, 5rem);
/* After */
font-size: clamp(3rem, 10vw, 8rem);
letter-spacing: -0.03em;
```

### 5. GSAP SplitText — テキストの文字単位アニメ
**対象**: 各テーマのヒーロータイトル
CDN 経由で `gsap` + `SplitText` を読み込み、文字が1字ずつ現れる演出を追加。
`prefers-reduced-motion` を必ず確認してから適用すること。

---

## デザイン原則（全テーマ共通）

1. **アニメーションは `transform` / `opacity` のみ** — `width` / `height` 変化はリフローを起こすため避ける
2. **`prefers-reduced-motion` を必ず考慮** — `window.__utils.prefersReducedMotion()` で確認
3. **コントラスト比 WCAG AA 以上** — テキストは 4.5:1 以上を確保
4. **フォントは使うウェイトのみ読み込む** — `font-display: swap` を指定
5. **未使用 CSS は各テーマに閉じ込める** — グローバルに漏らさない
6. **`console.log` を本番コードに残さない**
