const express = require("express");
const auth = require("../auth");
const cartController = require("../controllers/cart");
const router = express.Router();
const cors = require("cors");

const { verify } = auth;

router.post("/addToCart", verify, cartController.addToCart);

router.put("/changeQuantity", verify, cartController.changeQuantity);

router.delete("/removeItem", verify, cartController.removeItem);

router.get("/getCart", cors(), verify, (req, res) => {
  res.set("Cache-Control", "no-store");
});

module.exports = router;
