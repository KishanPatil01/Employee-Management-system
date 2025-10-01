// Simple test (requires jest & supertest)
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    position TEXT,
    salary REAL
  )`);
});

app.post('/api/employees', (req, res) => {
  const { name, email, position, salary } = req.body;
  db.run("INSERT INTO employees (name,email,position,salary) VALUES (?,?,?,?)", [name,email,position,salary], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.get('/api/employees', (req, res) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

describe('Employee API', () => {
  it('creates and fetches an employee', async () => {
    const res1 = await request(app).post('/api/employees').send({
      name: 'Alice',
      email: 'alice@example.com',
      position: 'Designer',
      salary: 60000
    });
    expect(res1.statusCode).toBe(200);
    expect(res1.body).toHaveProperty('id');

    const res2 = await request(app).get('/api/employees');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.length).toBeGreaterThan(0);
  });
});
