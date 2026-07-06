# PROJECT.md

このファイルは、プロジェクトの現在地を短く把握するためのドキュメントです。
AI エージェントや新しい開発者が最初に読む前提情報として更新してください。

## 自動更新ルール

以下が変わった場合は、このファイルを更新してください。

- プロダクト名、目的、主なユーザー。
- 主要機能、対応範囲、非対応範囲。
- 技術スタック、外部サービス、デプロイ先。
- 現在の開発フェーズや優先度。
- 入口となる画面、コマンド、重要ファイル。

軽微な実装変更だけなら更新不要です。
5 回程度の意味ある変更、または 30 日程度を目安に内容を棚卸ししてください。

## 概要

| 項目 | 内容 |
|---|---|
| プロジェクト名 | iKnoWay Personal Site |
| 目的 | アニメと映画を愛するオタク iKnoWay のプロフィール・お気に入り作品・成果物を紹介する |
| 主なユーザー | サイト訪問者（iKnoWay に興味を持った人、テーマガチャを楽しむ人） |
| 利用シーン | アクセスするたびにテーマがランダムで切り替わる「ガチャ体験」つきポートフォリオ閲覧 |
| 現在のフェーズ | 運用中。テーマ追加と既存テーマの磨き込みを継続 |
| 本番 URL | https://iknoway-home.github.io/my-website/ |
| リポジトリ | my-homepage（GitHub、`main` ブランチ / `/docs` を公開） |

## 主要機能

| 機能 | 概要 | 入口 |
|---|---|---|
| テーマランダム切替 | 重み付きランダムでテーマを選択、`sessionStorage` でセッション中固定 | `docs/index.html` + `docs/theme-router.js` |
| 16 テーマ | classy / cyber / anime / y2k / terminal / magazine / kawaii / brutalist / vaporwave / zen / space / newspaper / apple / fantasy-book / winxp / data-js | `docs/themes/<name>/` |
| 共通コンテンツデータ | 全テーマが同じデータを読み描画する | `docs/shared/data.js`（`window.__data`） |
| ゲーム / 成果物セクション自動挿入 | 通常テーマに共通スクリプトでセクションを挿入 | `docs/shared/games.js` / `docs/shared/projects.js` |

## 非対応範囲

- バックエンド・DB・認証（純粋な静的サイト）。
- AI 駆動 UI、音声 / マルチモーダル、AR / VR / WebXR、アジェンティック UX（`ai-docs/ROADMAP.md` の Won't Do を参照）。

## 技術スタック

| 領域 | 技術 |
|---|---|
| フロントエンド | 素の HTML / CSS / JavaScript（バンドラー・フレームワーク不使用、外部ライブラリ依存ゼロ） |
| フォント | Google Fonts（Playfair Display / Lato / Caveat / Bebas Neue / Rajdhani / Noto Sans JP ほか） |
| バックエンド | なし |
| DB / Storage | なし（`sessionStorage` / `localStorage` のみ） |
| 認証 | なし |
| ホスティング | GitHub Pages（Branch `main` / Folder `/docs`） |
| CI / CD | なし（プッシュ = デプロイ）。AI docs 鮮度チェックの週次ワークフローのみ |

## 重要ファイル

| パス | 役割 |
|---|---|
| `AGENTS.md` | AI / 開発者向け作業ルール（`CLAUDE.md` / `GEMINI.md` / `QWEN.md` はここへのリンク） |
| `DESIGN.md` | デザイン方針・テーマ実装詳細 |
| `docs/shared/data.js` | 全コンテンツの単一の正 |
| `docs/theme-router.js` | テーマ選択ロジック（`THEMES` 配列） |
| `ai-docs/CODEMAP.md` | 機能の置き場所 |
| `ai-docs/ARCHITECTURE.md` | 設計と境界 |
| `ai-docs/ROADMAP.md` | 優先度と今後の方針 |
| `ai-docs/ENVIRONMENT.md` | 環境と設定 |
| `ai-docs/TESTING.md` | 確認手順 |
| `ai-docs/OPERATIONS.md` | 運用・デプロイ |
| `sops/` | 再利用手順 |

## 現在の優先事項

| 優先度 | 内容 | 状態 |
|---|---|---|
| 高 | winxp テーマと AI ドキュメント体系の未コミット差分を整理してコミット可能な状態にする | 進行中 |

## 最近の重要変更

| 日付 | 変更 | 関連ファイル |
|---|---|---|
| 2026-07-06 | AI ドキュメント体系（AGENTS.md / ai-docs / sops / 鮮度チェック）を導入 | `AGENTS.md`, `ai-docs/`, `sops/`, `scripts/ai-docs-status.sh` |
| 2026-07 頃 | winxp テーマを追加（未コミット） | `docs/themes/winxp/` |

## 未解決の論点

- なし
