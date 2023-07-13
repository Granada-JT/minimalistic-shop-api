// Imports the required dependencies and modules.
const express = require('express');
const auth = require('../auth');
const orderController = require('../controllers/order');
const router = express.Router();

const { verify, verifyAdmin } = auth;

// This route is for creating an order.
router.post("/createOrder", verify, orderController.createOrder)

// This route is for retrieving all orders.
router.get("/allOrders", verify, verifyAdmin, orderController.getAllOrders)

module.exports = router;