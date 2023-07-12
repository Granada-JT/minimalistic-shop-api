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

// This route is for retrieving a single product.
router.get("/:productId", productController.retrieveProduct)

// This route is for updating a product's information
router.put("/:productId/updateProduct", verify, verifyAdmin, productController.updateProduct)

// This route is for archiving a product.
router.put("/:productId/archiveProduct", verify, verifyAdmin, productController.archiveProduct)

// This route is for activating a product.
router.put("/:productId/activateProduct", verify, verifyAdmin, productController.activateProduct)





module.exports = router;