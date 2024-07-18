const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.route('/login')
    .post(authController.login)

router.route('/register')
    .post()

router.route('/refresh')
    .get()

router.route('/logout')
    .post()

module.exports = router;