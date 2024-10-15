const express = require("express");
const userController = require("../controllers/user");
const auth = require("../auth");
const router = express.Router();

const { verify, verifyAdmin } = auth;

router.post("/checkEmail", userController.checkEmailExists);

router.post("/registration", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/userDetails", verify, userController.getUserDetails);

router.put("/profile", verify, userController.updateProfile);

router.put("/reset-password", verify, userController.resetPassword);

router.put("/updateToAdmin", verify, verifyAdmin, userController.updateToAdmin);

router.get("/getOrders", verify, userController.getOrders);

router.get("/getCheckout", verify, userController.getCheckout);

module.exports = router;
