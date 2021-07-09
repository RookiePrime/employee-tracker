const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'daP@ssw0rdz',
    database: 'employee_management'
});

module.exports = db;