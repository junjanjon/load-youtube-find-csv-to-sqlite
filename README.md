# load-csv-to-sqlite

https://github.com/iwakiridrcm/youtube-find/ から YouTube の投稿数データを取得して、sqlite3 に保存するプログラムです。

## 使い方

### requirements

- git
- node.js
- npm

### 実行

```bash
./main.sh
```

実行結果が `youtube.db` に保存されます。

### 中身の確認方法例

```bash
sqlite3 youtube.db .dump
```
