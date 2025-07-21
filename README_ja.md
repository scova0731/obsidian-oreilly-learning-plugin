# Obsidian O'Reilly Learning Plugin

O'Reilly Learningのハイライトとメモを[Obsidian](https://obsidian.md)のVaultに直接インポートします。技術的な知識を整理し、自分の管理下に置きましょう。

## 概要

このプラグインを使用すると、O'Reilly Learning Platformからハイライトをエクスポートし、Obsidianにインポートできます。学習ノートは常に自分の管理下にあり、クラウドに閉じ込められることはありません。

## 機能

- 📚 **O'Reilly Learningからハイライトをインポート** — すべての書籍のハイライトと注釈をエクスポート
- 📝 **スマートな整理** — 読書順でソートされたハイライトを含むマークダウンファイルを作成
- 📂 **柔軟なファイル管理** — Vault内の保存場所を自由に選択
- 🔗 **ダイレクトリンク** — 各ハイライトにO'Reillyの正確な位置へのリンクを含む
- 🚀 **シンプルなワークフロー** — スクリプトをコピー、ブラウザで実行、JSONファイルをインポート

## インストール

### Obsidianコミュニティプラグインから（近日公開）

1. **設定** → **コミュニティプラグイン**を開く
2. **ブラウズ**をクリックし、「O'Reilly Learning」を検索
3. **インストール**、その後**有効化**をクリック

### 手動インストール

1. [Releases](https://github.com/scova0731/obsidian-oreilly-learning-plugin/releases)ページから最新リリースをダウンロード
2. `obsidian-oreilly-learning-plugin`フォルダをVaultの`.obsidian/plugins/`ディレクトリに展開
3. Obsidianを再読み込み
4. **設定** → **コミュニティプラグイン**でプラグインを有効化

## 使用方法

### ステップ1: ハイライトをエクスポート

1. [O'Reilly Learning](https://learning.oreilly.com)にログイン
2. ブラウザコンソールを開く（F12 → Console）
3. Obsidianで本のアイコンをクリック、またはコマンドパレットから「Import O'Reilly highlights from JSON」を実行
4. モーダルからエクスポートスクリプトをコピー（クリックでコピー）
5. ブラウザコンソールに貼り付けて実行
6. JSONファイルが自動的にダウンロードされます

### ステップ2: Obsidianにインポート

1. 同じモーダルで「Choose file」をクリック
2. ダウンロードしたJSONファイルを選択
3. ハイライトが書籍ごとに整理されてインポートされます

### ファイル構成

デフォルトでは、ハイライトは以下に保存されます：
```
oreilly-highlights/
├── 書籍タイトル1.md
├── 書籍タイトル2.md
└── ...
```

各書籍ファイルには以下が含まれます：
- 書籍のメタデータ（ISBN、カバー画像、O'Reilly URL）
- 読書順でソートされたすべてのハイライト
- 簡単なナビゲーションのための章ヘッダー
- あなたの個人的なメモ/注釈
- 各ハイライト位置へのダイレクトリンク

## 設定

### 設定項目

| 設定 | 説明 | デフォルト |
|---------|-------------|---------|
| **ハイライトフォルダ** | インポートしたハイライトの保存先 | `oreilly-highlights/` |

## 出力例

```markdown
# Learning Python, 5th Edition

![Cover](https://learning.oreilly.com/covers/...)

**ISBN:** 9781449355739
**URL:** [View on O'Reilly](https://learning.oreilly.com/library/view/...)

---

## Highlights

### Chapter 1: A Python Q&A Session

Python is a general-purpose programming language... - [link](https://learning.oreilly.com/.../ch01.html#abc123)

**Location:** 42

---

### Chapter 2: How Python Runs Programs

Source code you type is translated to byte code... - [link](https://learning.oreilly.com/.../ch02.html#def456)

**Note:** パフォーマンスを理解するための重要な概念

**Location:** 156

---
```

## トラブルシューティング

### エクスポートスクリプトが動作しない
- O'Reilly Learningにログインしていることを確認
- ページを更新してスクリプトを再実行してみてください
- ブラウザコンソールでエラーメッセージを確認
- 一部の書籍には特殊文字が含まれている場合があります

### インポートが失敗する
- JSONファイルが完全にダウンロードされていることを確認
- 正しいファイルを選択していることを確認
- ファイルが破損していないことを確認

### ハイライトの表示順がおかしい
- プラグインは異なるハイライト形式を自動的に検出して処理します
- 位置データがある書籍は読書位置の順でソートされます
- 位置データがない書籍は作成日時でソートされます

## 貢献

貢献を歓迎します！イシューやプルリクエストをお気軽に提出してください。

## ライセンス

[MIT License](LICENSE)

## 謝辞

- @hadynzによる[obsidian-kindle-plugin](https://github.com/hadynz/obsidian-kindle-plugin)にインスパイアされました
- [Obsidian API](https://github.com/obsidianmd/obsidian-api)を使用して構築
- [Claude Code](https://github.com/anthropics/claude-code)のサポートを受けて開発

---

ObsidianとO'Reilly Learningコミュニティのために❤️を込めて作りました