// Imports the required dependencies and modules.
const express = require('express');
const userController = require('../controllers/user');
const auth = require('../auth');
const router = express.Router();

const { verify, verifyAdmin } = auth;

// This route is for checking if the user email already exists.
router.post("/checkEmail", userController.checkEmailExists)

// This route is for user registration.
router.post('/registration', userController.registerUser)

// This route is for logging in the user and for generating his/her bearer/access token.
router.post("/login", userController.loginUser);

// This route is for retrieving user details.
router.get("/userDetails", verify, userController.getUserDetails)

// This route is for resetting the password of a single user.
router.put("/reset-password", verify, userController.resetPassword)

// This route is for updating a non-admin user to an admin.
router.put ("/updateToAdmin", verify, verifyAdmin, userController.updateToAdmin)

// This route is for retrieving authenticated user's details.
router.get("/getOrders", verify, userController.getOrders)

module.exports = router;