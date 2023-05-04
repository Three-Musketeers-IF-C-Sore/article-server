const express = require('express');
const router = express.Router();

const ArticleController = require('../controller/ArticleController');
const { validateArticle } = require('../middleware/articleValidator');
const { authMid } = require('../middleware/authMid');

router.get('/articles', ArticleController.index);
router.get('/articles/:id', ArticleController.show);
router.post('/articles', authMid, validateArticle, ArticleController.store);
router.put('/articles/:id', authMid, validateArticle, ArticleController.update);
router.delete('/articles/:id', authMid, ArticleController.destroy);

module.exports = router;