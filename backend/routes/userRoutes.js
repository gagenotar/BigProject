const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const verifyJWT = require('../middleware/verifyJWT.js');