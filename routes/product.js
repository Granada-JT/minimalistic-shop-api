// Imports the required dependencies and modules.
const express = require("express");
const auth = require("../auth");
const productController = require("../controllers/product");
const router = express.Router();

const { verify, verifyAdmin } = auth;

// This route is for creating a product.
router.post("/", verify, verifyAdmin, productController.createProduct);

// This route is for retrieving all products.
router.get("/all", productController.retrieveAllProducts);

// This route is for retrieving all active products.
router.get("/", productController.allActiveProducts);

// This route is for retrieving a single product.
router.get("/:productId", productController.retrieveProduct);

// This route is for updating a product's information.
router.put(
  "/:productId/updateProduct",
  verify,
  verifyAdmin,
  productController.updateProduct,
);

// This route is for archiving a product.
router.put(
  "/:productId/archiveProduct",
  verify,
  verifyAdmin,
  productController.archiveProduct,
);

// This route is for activating a product.
router.put(
  "/:productId/activateProduct",
  verify,
  verifyAdmin,
  productController.activateProduct,
);

// This route is for searching for products by name.
router.post("/search", productController.searchProductsByName);

module.exports = router;
