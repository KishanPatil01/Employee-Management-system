const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Ensure local folder exists
if (!process.env.RENDER) {
  const folderPath = path.join(__dirname, "..", "data");
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log("✅ Created data folder");
  }
}

const dbPath = process.env.RENDER
  ? path.join("/tmp", "employees.db")
  : path.join(__dirname, "..", "data", "employees.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ DB connection error:", err);
  else console.log("✅ Connected to SQLite DB at", dbPath);
});

db.run(
  `CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    position TEXT NOT NULL,
    salary REAL NOT NULL
  )`,
  (err) => {
    if (err) console.error("❌ Table creation error:", err);
    else console.log("✅ Employees table ready");
  }
);

module.exports = db;
