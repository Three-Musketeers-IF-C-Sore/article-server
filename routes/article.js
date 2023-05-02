const express = require('express');
const router = express.Router();

const ArticleController = require('../controller/ArticleController');
const { validateArticle } = require('../middleware/articleValidator');
const { authMid } = require('../middleware/authMid');

router.get('/articles', ArticleController.index);
router.post('/articles', authMid, validateArticle, ArticleController.store);

module.exports = router;