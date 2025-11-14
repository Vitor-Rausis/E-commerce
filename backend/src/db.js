const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { DB_PATH } = require('./config');

const ensureDatabaseDir = () => {
  const dir = require('path').dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDatabaseDir();

const db = new sqlite3.Database(DB_PATH);

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function runCallback(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });

const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

const runInTransaction = async (callback) => {
  await dbRun('BEGIN TRANSACTION');
  try {
    const result = await callback();
    await dbRun('COMMIT');
    return result;
  } catch (error) {
    await dbRun('ROLLBACK');
    throw error;
  }
};

const initDb = async () => {
  await dbRun(
    `CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco REAL NOT NULL,
        imagem_url TEXT,
        estoque INTEGER DEFAULT 0,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
      )`
  );

  await dbRun(
    `CREATE TABLE IF NOT EXISTS vendas (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        total REAL NOT NULL,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
      )`
  );

  await dbRun(
    `CREATE TABLE IF NOT EXISTS itens_venda (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id TEXT NOT NULL,
        produto_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        preco_unitario REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (venda_id) REFERENCES vendas (id),
        FOREIGN KEY (produto_id) REFERENCES produtos (id)
      )`
  );
};

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll,
  runInTransaction,
  initDb,
};

