const router = require('express').Router();
const db = require('../../config/connection');

// Gets all roles
router.get('/', (req, res) => {
    const sql = `SELECT
	                roles.title, roles.id,
	                departments.name AS department,
	                roles.salary
                 FROM roles
                 LEFT JOIN departments
                 ON roles.department_id = departments.id`
    
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

// Adds a new role
router.post('/', ({ body }, res) => {
    const sql = `INSERT INTO roles (title, salary, department_id)
                    VALUES (?,?,?)`;
    const params = [body.title, body.salary, body.department_id];

    db.query(sql, params, (err, result) => {
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