// Dependencies and Modules
const express = require('express');
const auth = require('../auth');
const productController = require('../controllers/product');
const router = express.Router();

// Destructure the Auth file
const { verify, verifyAdmin } = auth;











module.exports = router;