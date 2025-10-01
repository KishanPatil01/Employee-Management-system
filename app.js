// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// GET all employees
app.get('/api/employees', (req, res) => {
    db.all("SELECT * FROM employees", [], (err, rows) => {
        if (err) res.status(400).json({ error: err.message });
        else res.json(rows);
    });
});

// GET employee by ID
app.get('/api/employees/:id', (req, res) => {
    db.get("SELECT * FROM employees WHERE id = ?", [req.params.id], (err, row) => {
        if (err) res.status(400).json({ error: err.message });
        else res.json(row);
    });
});

// POST - Create new employee
app.post('/api/employees', (req, res) => {
    const { name, email, position, salary } = req.body;
    db.run(
        "INSERT INTO employees (name, email, position, salary) VALUES (?, ?, ?, ?)",
        [name, email, position, salary],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

// PUT - Update employee
app.put('/api/employees/:id', (req, res) => {
    const { name, email, position, salary } = req.body;
    db.run(
        "UPDATE employees SET name = ?, email = ?, position = ?, salary = ? WHERE id = ?",
        [name, email, position, salary, req.params.id],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ changes: this.changes });
        }
    );
});

// DELETE - Delete employee
app.delete('/api/employees/:id', (req, res) => {
    db.run("DELETE FROM employees WHERE id = ?", [req.params.id], function(err) {
        if (err) res.status(400).json({ error: err.message });
        else res.json({ changes: this.changes });
    });
});

// Export app for use in server.js
module.exports = app;