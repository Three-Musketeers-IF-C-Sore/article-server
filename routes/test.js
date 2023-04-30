const express = require("express");
const router = express.Router();
const TestController = require("../controller/TestController.js");


router.get("/", TestController.test);


module.exports = router;
