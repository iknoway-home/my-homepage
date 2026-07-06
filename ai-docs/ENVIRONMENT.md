# ENVIRONMENT.md

このファイルは、環境変数、設定ファイル、外部サービス、ローカル起動条件を記録するためのドキュメントです。
秘密情報そのものは書かず、名前、用途、取得場所、注意点だけを書きます。

## 自動更新ルール

以下が変わった場合は、このファイルを更新してください。

- 環境変数や設定ファイルを追加・削除・変更した。
- 起動手順を変えた。
- 外部サービス（ホスティング、フォント CDN など）を追加・変更した。
- ローカルと本番の差分が変わった。

秘密値は絶対に書かないでください。

## 環境

| 環境 | 用途 | URL / 入口 | 注意 |
|---|---|---|---|
| local | ローカル開発 | `http://localhost:8080`（下記コマンドで起動） | `file://` 直開きは Canvas などが制限される場合あり |
| staging | 検証 | なし | 検証環境は持たない。プッシュ前にローカルで確認する |
| production | 本番 | https://iknoway-home.github.io/my-website/ | `main` の `/docs` がそのまま公開される |

## 環境変数

なし（静的サイトのため）。

## 設定ファイル

| ファイル | 用途 | 注意 |
|---|---|---|
| `.claude/settings.json` | Claude Code の SessionStart フック（AI docs 鮮度チェック） | チーム共有設定 |
| `.claude/settings.local.json` | 個人ローカルの許可設定 | コミットしない運用が無難 |
| `.github/workflows/ai-docs-freshness.yml` | 週次の AI docs 鮮度チェック | 陳腐化時にイシューを作成 |

## 外部サービス

| サービス | 用途 | 管理場所 | 注意 |
|---|---|---|---|
| GitHub Pages | ホスティング | リポジトリ設定（Branch `main` / Folder `/docs`） | ビルドなし。プッシュ = 公開 |
| Google Fonts | Web フォント | 各テーマの `index.html` | 使うウェイトのみ読み込む |

## ローカル起動

```bash
cd docs && python3 -m http.server 8080
# または
npx serve docs
```

`http://localhost:8080` を開く。`?theme=<id>` でテーマ固定、`?switch=1` で強制切替。

## よくある問題

| 症状 | 原因 | 対応 |
|---|---|---|
| Canvas パーティクル等が動かない | `file://` 直開きの制限 | ローカルサーバー経由で開く |
| テーマが切り替わらない | `sessionStorage` にテーマが保持されている | 新しいタブで開くか `?switch=1` を付ける |
