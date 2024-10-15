const express = require("express");
const auth = require("../auth");
const orderController = require("../controllers/order");
const router = express.Router();

const { verify, verifyAdmin } = auth;

router.post("/createOrder", verify, orderController.createOrder);

router.get("/allOrders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;
