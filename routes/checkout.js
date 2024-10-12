const express = require("express");
const auth = require("../auth");
const checkoutController = require("../controllers/checkout");
const router = express.Router();

const { verify } = auth;

router.post("/", verify, checkoutController.checkoutOrder);

module.exports = router;
