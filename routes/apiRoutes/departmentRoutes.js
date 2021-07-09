const router = require('express').Router();
const db = require('../../config/connection');

// Gets all the departments
router.get('/', (req, res) => {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Adds a department
router.post('/', ({ body }, res) => {
    const sql = `INSERT INTO departments (name) VALUES (?)`;

    db.query(sql, [body.name], (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            changes: result.affectedRows
        });
    });
});

module.exports = router;