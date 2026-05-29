# iKnoWay — Personal Site

アニメと映画を愛するオタク、iKnoWay の個人サイト。
アクセスするたびにテーマがランダムで切り替わり、毎回違う表情を見せます。

---

## テーマ一覧

| テーマ | コンセプト | 主な技術的特徴 |
|---|---|---|
| **classy** | スターバックス風 — ダークグリーンの壁・木目・黒板・暖かい光 | CSS グラデーションライト演出 / 木目テクスチャ / Caveat フォント黒板 |
| **anime** | サイバーパンク・アニメ風 — 漆黒 × ネオン × グリッチ | Canvas パーティクル / グリッチ CSS アニメ / CRT スキャンライン |

---

## ディレクトリ構成

```
/docs                    GitHub Pages 公開 & 開発ディレクトリ
├─ index.html            エントリーポイント（ローダー + テーマ選択）
├─ theme-router.js       テーマ選択ロジック
│
├─ themes/
│   ├─ classy/           おしゃれ系テーマ（index.html / style.css / script.js）
│   └─ anime/            サイバーパンクアニメ系テーマ（index.html / style.css / script.js）
│
└─ shared/
    ├─ data.js           全テーマ共通コンテンツデータ
    ├─ games.js          ゲームセクションの共通描画
    ├─ projects.js       成果物セクションの共通描画
    └─ utils.js          全テーマ共通ユーティリティ関数
```

---

## コンテンツの仕組み

プロフィール・ゲーム・お気に入りアニメ・お気に入り映画・成果物・連絡先などのコンテンツは
`shared/data.js` に一元管理されています。各テーマは同じデータを読み取り、
テーマ固有のデザインで描画します。

**コンテンツを変更したいときは `shared/data.js` を編集するだけでOK。**

---

## テーマ切替の仕組み

サイトは `sessionStorage` を使ってセッション中のテーマを固定します。
新しいセッション（タブを閉じて再度開いたとき）に再びランダム選択されます。

| URL | 動作 |
|---|---|
| `docs/index.html` | ランダムでテーマを選択・表示 |
| `docs/index.html?switch=1` | 現在と**異なる**テーマに強制切替 |
| `docs/index.html?theme=classy` | `classy` テーマを固定表示（開発用） |
| `docs/index.html?theme=anime` | `anime` テーマを固定表示（開発用） |

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

ビルドステップは不要です。`/docs` ディレクトリをそのまま静的ホスティングに配置するだけで動作します。

### ローカルで確認する

`file://` 直開きだと Canvas などが制限される場合があるため、簡易サーバーを使うことを推奨します。

```bash
# Python がある場合
cd docs && python3 -m http.server 8080

# Node.js がある場合
npx serve docs
```

その後 `http://localhost:8080` にアクセス。

### GitHub Pages（現在の設定）

- **公開ディレクトリ**: `/docs`（Branch `main` / Folder `/docs`）
- **公開 URL**: `https://iknoway-home.github.io/my-website/`

`docs/` を編集してプッシュすればそのまま反映されます。同期作業は不要です。

---

## テーマを追加したい場合

1. `docs/themes/` に新ディレクトリを作成し `index.html` / `style.css` / `script.js` を実装
2. `script.js` 内で `window.__data` を読み取ってコンテンツを描画する
3. `docs/theme-router.js` の `THEMES` 配列にエントリを追加

新規テーマのヘッダーは `site-header` / `nav-inner` / `nav-logo` / `nav-links` / `nav-switch` を使い、`style.css` の後に `../../shared/human-polish.css` を読み込んでください。
ヘッダーと共通ボタンの位置・サイズは `human-polish.css` の `--chrome-*` で全テーマ共通管理します。
通常テーマでは `../../shared/data.js` の後に `../../shared/games.js` と `../../shared/projects.js` も読み込んでください。ゲーム一覧はAnime直前、成果物一覧はContactとは別セクションとして自動挿入されます。

```js
const THEMES = [
  { id: 'classy',       path: 'themes/classy/index.html',       weight: 1 },
  { id: 'anime',        path: 'themes/anime/index.html',        weight: 1 },
  { id: 'future-theme', path: 'themes/future-theme/index.html', weight: 1 }, // <- 追加
];
```

`weight` の値で出現確率を調整できます。

---

## カスタマイズ

コンテンツの変更は `docs/shared/data.js` のみで行えます。

- プロフィール情報（名前・役割・自己紹介・特徴）
- お気に入りアニメ一覧（タイトル・コメント・タグ）
- お気に入り映画一覧（タイトル・コメント・タグ）
- 連絡先（メールアドレス・メッセージ）
- SNS リンク（GitHub / Twitter など）

---

## ライセンス

このリポジトリのコードは [MIT License](LICENSE) のもとで公開しています。
