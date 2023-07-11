// Imports required dependencies and modules.
const express = require('express');
const auth = require('../auth');
const productController = require('../controllers/product');
const router = express.Router();

const { verify, verifyAdmin } = auth;

// This route is for creating a productl
router.post("/createProduct", verify, verifyAdmin, productController.createProduct)

// This route is for retrieving all products.
router.get("/allProducts", productController.retrieveAllProducts)

// This route is for retrieving all active products.
router.get("/allActiveProducts", productController.allActiveProducts)




module.exports = router;