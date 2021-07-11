const router = require('express').Router();
const db = require('../../config/connection');

// Gets all employees in a very fancy, comprehensive table
router.get('/', (req, res) => {
    const sql = `SELECT
	                e1.id,
	                CONCAT(e1.last_name, ', ', e1.first_name) AS employee,
	                roles.title,
	                departments.name AS department,
	                roles.salary,
	                CONCAT(e2.last_name, ', ', e2.first_name) AS manager
                 FROM employees e1
                 LEFT JOIN employees e2
	                ON e1.manager_id = e2.id
                 LEFT JOIN roles
	                ON e1.role_id = roles.id
                 LEFT JOIN departments
	                ON roles.department_id = departments.id`;

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

// Gets a list of managers in the system. Which I overthought, because realistically you don't need a list of just managers, you want a list of all employees so you can assign any employee as a manger. But hey, I wrote it, so it stays
router.get('/managers', (req, res) => {
    const sql = `SELECT 
                    DISTINCT e2.id, e2.last_name 
                FROM employees e1 
                LEFT JOIN employees e2 
                ON e1.manager_id = e2.id 
                WHERE e1.manager_id != 'NULL' 
                ORDER BY e2.id ASC`
    
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

// Adds a new employee
router.post('/', ({ body }, res) => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUES (?,?,?,?)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

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

// Changes an employee's role
router.put('/:id', (req, res) => {
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
    const params = [req.body.role_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: req.body,
            changes: result.affectedRows
        });
    });
});

module.exports = router;