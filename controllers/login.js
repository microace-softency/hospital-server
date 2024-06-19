const express = require("express");
router = express.Router();
const { login, signup } = require('../modeles/authController');


const db = require("../db");

router.post('/login', login);
router.post('/signup', signup);

module.exports = router;