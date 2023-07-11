// Importing the required dependencies and modules
const express = require('express');
const userController = require('../controllers/user');
const auth = require('../auth');
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const router = express.Router();


const { verify, verifyAdmin } = auth;

// This route is for checking if the user email already exists.
router.post("/checkEmail", userController.checkEmailExists)

// This route is for user registration
router.post('/registration', userController.registerUser)

// This route is for logging in the user and for generating his/her bearer/access token.
router.post("/login", userController.loginUser);






module.exports = router;