const express = require('express');
const router = express.Router();

const AuthController = require('../controller/AuthController');
const { validateUser } = require('../middleware/userValidator');

router.post('/register', validateUser, AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;