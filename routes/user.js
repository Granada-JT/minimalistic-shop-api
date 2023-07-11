// Dependencies and Modules
const express = require('express');
const userController = require('../controllers/user');
const auth = require('../auth');
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const router = express.Router();

// Destructure the auth file:
const { verify, verifyAdmin } = auth;

// Route for checking if user email already exists
router.post("/checkEmail", userController.checkEmailExists)

// Route for user registration
router.post('/registration', userController.registerUser)

// Route for user autentication
router.post("/login", userController.loginUser);






module.exports = router;