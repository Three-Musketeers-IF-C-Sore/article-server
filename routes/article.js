const express = require('express');
const router = express.Router();

const ArticleController = require('../controller/ArticleController');
const { authMid } = require('../middleware/authMid');

router.get('/articles', ArticleController.index);
router.get('/articles/:id', ArticleController.show);
router.patch('/articles/like/:id', authMid, ArticleController.like);

module.exports = router;