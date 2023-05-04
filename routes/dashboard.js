const express = require('express');
const router = express.Router();

const DashboardController = require('../controller/DashboardController');

router.get('/dashboard', DashboardController.index);

module.exports = router;