const express = require('express');
const auth = require('../auth');
const cartController = require('../controllers/cart');
const router = express.Router();
const cors = require('cors');

const { verify, verifyAdmin } = auth;

// This route is for adding orders into the cart
router.post("/addToCart", verify, cartController.addToCart)

// This route is for changing the product quantities
router.put("/changeQuantity", verify, cartController.changeQuantity)

// This route is for removing items from the cart.
router.delete("/removeItem", verify, cartController.removeItem)

// This route is for retrieving the cart details.
router.get("/getCart", cors(), verify, (req, res) => {
    // Set the Cache-Control header to prevent caching
    res.set('Cache-Control', 'no-store'); // 'no-store' prevents caching completely
  
    // Call the getCart function from your cartController
    // to retrieve and send the cart details to the client
    cartController.getCart(req, res);
  });
module.exports = router;
