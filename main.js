const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const sqliteFilePath = path.join(__dirname, 'youtube.db');
const tableName = 'youtube';
// CSVファイルのヘッダー
const headers = {
    'title': 'TEXT',
    'date': 'TEXT',
    'play': 'INTEGER',
    'liveview': 'INTEGER',
    'posts': 'INTEGER',
};
// CSVファイルが入っているディレクトリ
const targetParentDir = path.join(__dirname, 'youtube-find');

function main() {
    // SQLiteファイルを削除する
    if (fs.existsSync(sqliteFilePath)) {
        fs.rmSync(sqliteFilePath);
    }
    // SQLiteデータベースを開く
    const db = new sqlite3.Database(sqliteFilePath);

    // targetParentDir から csv ファイルを再帰的に取得
    const targetDirs = fs.readdirSync(targetParentDir, { withFileTypes: false });
    targetDirs.forEach((targetDir) => {
        if (targetDir === '.git') {
            return;
        }
        const targetDirPath = path.join(targetParentDir, targetDir);
        const isDirectory = fs.statSync(targetDirPath).isDirectory();
        if (!isDirectory) {
            return;
        }
        const files = fs.readdirSync(targetDirPath, { withFileTypes: false });
        files.forEach((file) => {
            const filePath = path.join(targetDirPath, file);
            if (!filePath.endsWith('.csv')) {
                return;
            }
            console.log(`Reading ${filePath}`);
            // CSVファイルを読み込み、データを配列に格納
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv({ headers: Object.keys(headers) }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    // CSVファイルのデータをデータベースに挿入
                    db.serialize(() => {
                        const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${Object.keys(headers).map((key) => `${key} ${headers[key]}`).join(', ')})`;
                        db.run(createTableQuery);
                        const prepareValues = Object.keys(headers).map((_) => '?').join(',');
                        const stmt = db.prepare(`INSERT INTO ${tableName} VALUES (${prepareValues})`);
                        results.forEach((data) => {
                            const insertData = [];
                            for (let i = 0; i < Object.keys(headers).length; i++) {
                                insertData.push(data[Object.keys(headers)[i]]);
                            }
                            // console.log(`Inserting ${insertData}`);
                            stmt.run(insertData);
                        });
                        stmt.finalize();
                    });
                });
        });
    });
}

main();
