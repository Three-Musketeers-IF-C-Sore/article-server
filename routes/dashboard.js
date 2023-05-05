const express = require('express');
const router = express.Router();

const DashboardController = require('../controller/DashboardController');
const { validateArticle } = require('../middleware/articleValidator');

router.get('/articles', DashboardController.index);
router.get('/articles/:id', DashboardController.show);
router.post('/articles', validateArticle, DashboardController.store);
router.put('/articles/:id', validateArticle, DashboardController.update);
router.delete('/articles/:id', DashboardController.destroy);

module.exports = router;