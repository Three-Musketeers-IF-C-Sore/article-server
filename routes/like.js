const express = require('express');
const router = express.Router();

const LikeController = require('../controller/LikeController');

router.get('/like', LikeController.index);
router.post('/like/:id', LikeController.store);

module.exports = router;