const express = require("express");
const auth = require("../auth");
const productController = require("../controllers/product");
const router = express.Router();

const { verify, verifyAdmin } = auth;

router.post("/", verify, verifyAdmin, productController.createProduct);

router.get("/all", productController.retrieveAllProducts);

router.get("/", productController.allActiveProducts);

router.get("/:productId", productController.retrieveProduct);

router.put(
  "/:productId/updateProduct",
  verify,
  verifyAdmin,
  productController.updateProduct,
);

router.put(
  "/:productId/archiveProduct",
  verify,
  verifyAdmin,
  productController.archiveProduct,
);

router.put(
  "/:productId/activateProduct",
  verify,
  verifyAdmin,
  productController.activateProduct,
);

router.post("/search", productController.searchProductsByName);

module.exports = router;
