# DESIGN.md — iKnoWay Personal Site デザインドキュメント

このファイルはサイト全体のデザイン方針・実装済みテーマの詳細・最新技術トレンド調査結果をまとめたものです。
新テーマの制作・既存テーマの改修・デザインの意思決定に参照してください。

---

## 基本方針

- 見た目より先に、訪問者に何を伝えたいか（人柄・好きな作品・成果物）を明確にする。
- 主要な操作（テーマ切替、セクション移動、連絡先）は迷わず見つかる位置に置く。
- 情報は重要度順に並べ、画面内の視線移動を少なくする。
- 装飾よりも可読性、操作性、状態の分かりやすさを優先する。
- 既存のデザインパターン、余白、色、文言、共通コンポーネント（`shared/human-polish.css`）を優先する。
- 変更後は、PC とモバイルの両方で破綻がないか確認する。

## 自動更新ルール

UI、画面構成、デザインシステムに関わる変更をした場合は、このファイルも更新してください。

更新が必要な例:

- テーマを追加・削除・大幅改修した。
- 配色、フォント、余白、角丸、影、ブレークポイントを変えた。
- 共通資産（`human-polish.css`、`games.js`、`projects.js` など）の使い方を変えた。
- 新しいデザインルールや禁止事項を決めた。
- セクションごとの役割や情報設計が変わった。

更新しなくてよい例:

- 文言の微修正だけ。
- 実装内部の変更だけで、見た目や操作に変化がない。
- 一時的な試作で、採用しないことが明確なもの。

ドキュメントは常に現在の画面を説明する状態に保ってください。

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
  games: [{ title, status, comment, tags }],
  anime:  [{ title, comment, tags }],   // 9件
  movies: [{ title, comment, tags }],   // 6件
  projects: [{ name, url, description, tags }],
  contact: { message, email },
  social: [{ name, url, icon }]         // SVGインラインアイコン
};
```

### ゲームセクション — `shared/games.js`

通常テーマでは `shared/games.js` が `window.__data.games` を読み取り、Animeの直前に `#games` セクションを挿入する。
新規テーマでは `data.js` の後、`projects.js` の前に `games.js` を読み込むこと。
`fantasy-book` のような特殊ページ構造では、テーマ固有の `script.js` 内で `data.games` を使って独立ページとして描画する。

### 成果物セクション — `shared/projects.js`

通常テーマでは `shared/projects.js` が `window.__data.projects` を読み取り、Contactとは別の `#projects` セクションをContact直前に挿入する。
新規テーマでは `data.js` の後、`snap.js` の前に `projects.js` を読み込むこと。
`fantasy-book` のような特殊ページ構造では、テーマ固有の `script.js` 内で `data.projects` を使って独立ページとして描画する。

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

### 共通クローム固定ルール — `shared/human-polish.css`

全テーマのヘッダーと共通操作ボタンは、見た目ではなく **位置・サイズ・ヒットエリアだけ** を `shared/human-polish.css` で固定する。
各テーマの `style.css` は色、角丸、影、ボーダー、ホバー演出などの世界観を担当し、ヘッダー/ボタンの寸法は共通レイヤーに任せる。

新規テーマを追加するときは、通常テーマでは以下のクラス名を使い、必ず `style.css` の後に `../../shared/human-polish.css` を読み込む。

```html
<header class="site-header" id="site-header">
  <nav class="nav-inner">
    <span class="nav-logo">iKnoWay</span>
    <ul class="nav-links">...</ul>
    <a class="nav-switch" href="../../index.html?switch=1">Switch Theme</a>
  </nav>
</header>
```

特殊なナビゲーションテーマでは `book-header` / `chapter-nav` / `theme-switch` を使うと、同じ共通寸法が適用される。
共通値を変える場合は、各テーマへ個別に寸法を書き足さず、`human-polish.css` の `--chrome-*` カスタムプロパティを更新する。

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

### マイクロインタラクション共通パターン

> 「静的に見えるものは古さを感じさせる」— ホバー・フォーカス・スクロール・クリックに小さな動きを付ける。

```css
/* ボタン共通マイクロインタラクション */
.btn { transition: transform 200ms ease, box-shadow 200ms ease; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.2); }
.btn:active { transform: translateY(0); }
```

- リンク: アンダーラインが左から右にスライド（`::after` + `scaleX`）
- カード: ホバー時に `translateY(-4px)` + 影が深くなる
- すべてのインタラクティブ要素に `:focus-visible` スタイルを明示する

---

## 最新デザイン・技術トレンド調査（2026-05 更新）

調査対象：2026年公開のデザイントレンド記事、MDN / W3C の標準情報、生成AI UIに関するHCI論文。

### 参考ソース

| ソース | URL | 要点 |
|--------|-----|------|
| Creative Bloq: Graphic design trends 2026 | https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026 | 「Anti-AI Crafting」。過剰に滑らかなAI感への反動として、手触り、自然光、アナログ素材、ゆらぎ、プロセスの跡が差別化要素になる |
| Line25: Web Design Trends 2026 | https://line25.com/articles/web-design-trends-2026/ | bento grid、巨大タイポグラフィ、スクロール連動、dark mode、micro-interactions、アクセシブルな配色、サステナブル設計 |
| MDN: View Transition API | https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API | SPA / MPA 両方のビュー遷移をブラウザネイティブに扱える |
| W3C: Web Sustainability Guidelines | https://www.w3.org/TR/2025/DNOTE-web-sustainability-guidelines-20251002/ | 装飾・アニメーションは価値がある場合に限定し、ユーザー制御とパフォーマンスを重視 |
| arXiv: ChatGPT Implements Deceptive Designs | https://arxiv.org/abs/2411.03108 | GPT-4生成サイトに deceptive design pattern が混入しやすいことを示す研究 |
| arXiv: UX of AI-Generated Interface Prototypes | https://arxiv.org/abs/2605.15124 | AI生成プロトタイプは実用面は評価される一方、独自性・革新性で弱くなりやすい |

---

### AI臭いサイトデザインの典型

| 症状 | 見え方 | 改善方針 |
|------|--------|----------|
| 均一すぎるカード | 同じ角丸、同じ影、同じ余白、同じカード幅が全セクションに続く | bento 的な大小差、テーマ固有の枠線・紙面・端末・ページ表現を使う |
| 汎用SaaSヒーロー | 中央寄せの大見出し、薄いグラデ背景、抽象blob、CTA 2個のテンプレ感 | テーマの物理的な場を作る。カフェ、新聞、端末、宇宙船、書物など |
| 説明文が抽象的 | 「革新的」「没入感」「シームレス」などが多く、本人の具体性が薄い | `shared/data.js` の個人的な文体を主役にして、UIは読ませるために整える |
| 過剰なグローとぼかし | どのテーマも似た未来感・AI生成LP感になる | 光はテーマ由来に限定。紙ならインク、terminalならCRT、zenなら墨 |
| 装飾アニメの過多 | スクロールしても内容理解に関係ない動きが多い | W3C WSG に沿い、`prefers-reduced-motion` と価値ある動きだけにする |
| アクセシビリティの抜け | focus 表示なし、リンクの識別不足、モバイルで文字が詰まる | `:focus-visible`、`text-wrap: balance/pretty`、十分な line-height を全テーマで保証 |
| 生成AI的な倫理リスク | FOMO、過剰誘導、曖昧なCTA、誤解を誘うUI | この個人サイトでは煽り文句を避け、テーマ変更・連絡先などの動作を明確にする |

### AI臭くないサイトの特徴

1. **素材感がある**: 紙、インク、木目、CRT、スクリーントーン、星図、手書き線など、テーマに対応した質感がある。
2. **レイアウトに小さな癖がある**: 完全均等ではなく、見出し・カード・余白に意図的なリズムがある。
3. **本文が主役になる**: それっぽい短文ではなく、本人の好き嫌い・言い回し・具体的な作品コメントが見える。
4. **動きが目的を持つ**: 遷移、現在位置、次の章、カードの読みやすさを助ける動きに絞る。
5. **テーマ固有のルールがある**: cyber は端末、newspaper は紙面、fantasy-book は本、zen は余白と墨、y2k は個人サイト感、というようにUIが世界観に従う。
6. **完璧すぎないが雑ではない**: ノイズやゆらぎは入れるが、可読性、コントラスト、タップ領域は崩さない。

---

### 2026年の採用候補

| トレンド | 概要 | このサイトでの使い方 |
|----------|------|----------------------|
| Anti-AI Crafting | 手触り、アナログ素材、自然な不完全さ | 全テーマに「質感レイヤー」を追加。ただし抽象blobは禁止 |
| Bento / Broken Grid | 大小混在カードで単調さを避ける | anime / movies の一覧に wide / standard のリズムを付ける |
| Expressive Typography | 見出しそのものをビジュアルにする | H1 とセクション見出しをテーマごとにより強くする |
| Micro-interactions | 小さいが意味のあるフィードバック | リンク、テーマ変更、カードhover、focus状態に限定して強化 |
| View Transitions API | MPAでも遷移を滑らかにする | `@view-transition` はエントリで導入済み。テーマ切替の体感改善に使う |
| Performance / Sustainability | 装飾を軽く、必要な動きだけにする | CSS中心、画像追加なし、重い3Dや外部依存の追加は避ける |
| Accessible-first color | トレンド色より読める色 | テーマ色は残しつつ、本文とfocusだけは必ず読める値にする |

### 採用しないトレンド（このサイトのスコープ外）

| トレンド | 理由 |
|---|---|
| AI 駆動 UI | バックエンドなし・静的ファイルのみのため |
| 音声 / マルチモーダル | サイトの目的と合わない |
| AR / VR / WebXR | 実装コストに対して効果が薄い |
| アジェンティック UX | エージェント操作の必要がない |

---

### このサイトへの実装ルール

1. **テーマの物語を優先する**: 共通化で全部同じ見た目にしない。
2. **共通改善は `docs/shared/human-polish.css` に置く**: focus、文字詰め、bentoの基本、軽い質感など。
3. **テーマ固有の癖は各 `style.css` 末尾に置く**: 紙、墨、CRT、雑誌、宇宙船などはテーマ側で上書きする。
4. **装飾は1テーマ1主役まで**: glow、grain、pattern、motion を全部盛りしない。
5. **カードは同じ高さにしすぎない**: 長文コメントの個性を残し、必要なら段組みでリズムを作る。
6. **モーションは減速できるようにする**: `prefers-reduced-motion` を必ず尊重する。

---

### 注目ブラウザ API（静的サイト向け）

#### View Transitions API ⭐ 最優先
- SPA / MPA のビュー遷移をブラウザネイティブに扱えるAPI
- 対応状況は変化中のため、`@view-transition` とフォールバック前提で段階導入する
- ページ遷移・状態変化を `document.startViewTransition()` で囲むとアニメーション付与ができる
- **このサイトへの適用**: `theme-router.js` のテーマ切替（現在の `setTimeout + window.location.replace`）を置換すると格段に滑らかになる

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
| Creative Bloq: Graphic design trends 2026 | creativebloq.com | Anti-AI Crafting、手触り、タイプ、レイヤード表現 |
| Line25: Web Design Trends 2026 | line25.com/articles/web-design-trends-2026/ | bento grid、巨大タイポ、micro-interactions、アクセシビリティ |
| MDN: View Transition API | developer.mozilla.org/docs/Web/API/View_Transition_API | MPA / SPA 遷移APIのリファレンス |
| W3C: Web Sustainability Guidelines | w3.org/TR/web-sustainability-guidelines/ | 装飾・アニメーション・性能・アクセシビリティの判断基準 |
| arXiv: UX of AI-Generated Interface Prototypes | arxiv.org/abs/2605.15124 | AI生成UIの実用性と独自性の弱さに関するHCI研究 |

---

## このサイトへの適用候補（優先度順）

### 1. View Transitions API — テーマ切替の滑らか化
**対象**: `docs/theme-router.js`
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

## 命名規則（デザイン関連）

デザイン関連の名前は、見た目ではなく役割で付ける。

- よい例: `nav-switch`, `section-chalk`, `empty-state`, `hero-stats`
- 避ける例: `blue-button`, `big-box`, `left-area`, `new-style`

色や位置を名前に入れる場合は、それがテーマの世界観上の意味を持つときだけにする（例: `--neon-blue` はテーマトークンとして可）。

## 実装時の確認

UI 変更後は、最低限以下を確認する。

- 主要セクションが PC とモバイルで崩れていない。
- テキストがボタンやカードからはみ出していない。
- クリック / タップできる範囲が小さすぎない。
- 不要な横スクロールがない。
- `?theme=<id>` で対象テーマを固定表示し、`?switch=1` の切替動線が動く。
- `prefers-reduced-motion` 有効時に過剰な動きが止まる。

---

## デザイン原則（全テーマ共通）

1. **アニメーションは `transform` / `opacity` のみ** — `width` / `height` 変化はリフローを起こすため避ける
2. **`prefers-reduced-motion` を必ず考慮** — `window.__utils.prefersReducedMotion()` で確認
3. **コントラスト比 WCAG AA 以上** — テキストは 4.5:1 以上を確保
4. **フォントは使うウェイトのみ読み込む** — `font-display: swap` を指定
5. **未使用 CSS は各テーマに閉じ込める** — グローバルに漏らさない
6. **`console.log` を本番コードに残さない**

## やらないこと

- 画面ごとに別々の配色・余白・角丸を無秩序に増やす（テーマ内では一貫させる）。
- 装飾だけのカードや枠を過剰に増やす。
- 重要な操作を小さなアイコンだけにする。
- 説明文で UI の分かりにくさを補う。
- デザインルールを変更したのに `DESIGN.md` を更新しない。
