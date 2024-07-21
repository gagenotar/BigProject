const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.route('/login')
    .post(authController.login)

router.route('/register')
    .post(authController.register)

router.route('/refresh')
    .get(authController.refreshToken)

router.route('/logout')
    .post(authController.logout)

module.exports = router;