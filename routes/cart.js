// Imports the required dependencies and modules.
const express = require('express');
const auth = require('../auth');
const cartController = require('../controllers/cart');
const router = express.Router();

const { verify, verifyAdmin } = auth;

// This route is for adding orders into the cart
router.post("/addToCart", verify, cartController.addToCart)

// This route is for changing the product quantities
router.put("/changeQuantity", verify, cartController.changeQuantity)






module.exports = router;