const express = require('express');
const router = express.Router();

const roleRoutes = require('./roleRoutes');
const departmentRoutes = require('./departmentRoutes');
const employeeRoutes = require('./employeeRoutes');

router.use('/roles', roleRoutes);
router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);

module.exports = router;