# iKnoWay — Personal Site

iKnoWay の個人ポートフォリオサイト。
アクセスするたびにテーマがランダムで切り替わり、毎回違う表情を見せるサイトです。

---

## テーマ一覧

| テーマ | コンセプト | 主な技術的特徴 |
|---|---|---|
| **classy** | スターバックス風 — ダークグリーンの壁・木目・黒板・暖かい光 | CSS グラデーションライト演出 / 木目テクスチャ / Caveat フォント黒板 |
| **anime** | サイバーパンク・アニメ風 — 漆黒 × ネオン × グリッチ | Canvas パーティクル / グリッチ CSS アニメ / CRT スキャンライン |

---

## ディレクトリ構成

```
/site
├─ index.html          エントリーポイント（ローダー + テーマ選択）
├─ router.js           テーマ選択ロジック
│
├─ themes/
│   ├─ classy/         おしゃれ系テーマ（index.html / style.css / script.js）
│   ├─ anime/          サイバーパンクアニメ系テーマ（index.html / style.css / script.js）
│   └─ future-theme/   追加テーマ用プレースホルダー
│
├─ assets/
│   ├─ images/         プロフィール画像などの静的素材
│   ├─ fonts/          ローカルフォント（任意）
│   └─ sounds/         サウンドエフェクト（任意）
│
└─ shared/
    ├─ analytics.js    プライバシー配慮型アナリティクス
    └─ utils.js        全テーマ共通ユーティリティ関数
```

---

## テーマ切替の仕組み

サイトは `sessionStorage` を使ってセッション中のテーマを固定します。
新しいセッション（タブを閉じて再度開いたとき）に再びランダム選択されます。

| URL | 動作 |
|---|---|
| `site/index.html` | ランダムでテーマを選択・表示 |
| `site/index.html?switch=1` | 現在と**異なる**テーマに強制切替 |
| `site/index.html?theme=classy` | `classy` テーマを固定表示（開発用） |
| `site/index.html?theme=anime` | `anime` テーマを固定表示（開発用） |

各ページ内の「Switch Theme / GACHA」ボタンは `?switch=1` を使っています。

---

## 使用技術

- **HTML / CSS / JavaScript**（バンドラー・フレームワーク不使用）
- Google Fonts — Playfair Display / Lato / Caveat / Bebas Neue / Rajdhani / Noto Sans JP
- Canvas API（anime テーマのパーティクル）
- IntersectionObserver API（スクロールアニメーション）

外部ライブラリへの依存は **ゼロ** です。

---

## セットアップ・デプロイ

ビルドステップは不要です。`/site` ディレクトリをそのまま静的ホスティングに配置するだけで動作します。

### ローカルで確認する

`file://` 直開きだと Canvas などが制限される場合があるため、簡易サーバーを使うことを推奨します。

```bash
# Python がある場合
cd site && python3 -m http.server 8080

# Node.js がある場合
npx serve site
```

その後 `http://localhost:8080` にアクセス。

### 静的ホスティングへのデプロイ

| サービス | 設定 |
|---|---|
| GitHub Pages | `docs/` フォルダを公開ディレクトリとして使用（Branch `main` / Folder `/docs`）。`site/` 編集後は `cp -r site/. docs/` で同期すること |
| Netlify | リポジトリ接続・公開ディレクトリを `site` に指定 |
| Vercel | 同上 |
| Cloudflare Pages | 同上 |

---

## テーマを追加したい場合

1. `site/themes/` に新ディレクトリを作成し `index.html` / `style.css` / `script.js` を実装
2. `site/router.js` の `THEMES` 配列にエントリを追加

```js
const THEMES = [
  { id: 'classy',       path: 'themes/classy/index.html',       weight: 1 },
  { id: 'anime',        path: 'themes/anime/index.html',        weight: 1 },
  { id: 'future-theme', path: 'themes/future-theme/index.html', weight: 1 }, // ← 追加
];
```

`weight` の値で出現確率を調整できます。

---

## カスタマイズ

各テーマ内の以下の箇所を自分の情報に書き換えてください。

- メールアドレス（`href="mailto:..."` の部分）
- GitHub / Twitter / LinkedIn の URL
- プロジェクト名・説明・タグ
- スキル一覧
- プロフィール画像（`assets/images/` に画像を置いて HTML のコメントを解除）

---

## デザイン方針（2026 UI/UX トレンド）

このサイトは 2026 年の主要 UI/UX トレンドを踏まえて設計・改善しています。

| トレンド | 本サイトでの実装方針 |
|---|---|
| **マイクロインタラクション** | ホバー・クリック・スクロールすべてに小さな動きを付与。静的な要素はゼロを目標に |
| **表現的タイポグラフィ** | `clamp()` によるレスポンシブ大見出し / グラデーションテキスト / 文字スタガーアニメ |
| **ベントグリッド** | プロジェクト・スキルセクションを CSS Grid の大小カードで構成 |
| **ドーパミンデザイン** | 高コントラスト・高彩度配色で「見ていて気持ちいい」体験を優先 |
| **スクロール連動アニメ** | `IntersectionObserver` でセクション入場アニメ・カウントアップを制御 |
| **アクセシビリティ** | WCAG AA 準拠 / `prefers-reduced-motion` 対応 / フォーカス可視化 |
| **サステナブル Web** | WebP 画像 / `transform`・`opacity` のみのアニメ / 必要なフォントウェイトのみロード |

> 詳細な実装ガイドラインは [CLAUDE.md](CLAUDE.md) の「2026 UI/UX トレンドガイドライン」セクションを参照してください。

---

## ライセンス

このリポジトリのコードは [MIT License](LICENSE) のもとで公開しています。
