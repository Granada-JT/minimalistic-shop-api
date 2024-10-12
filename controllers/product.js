const Product = require("../models/Product");

module.exports.createProduct = (req, res) => {
  Product.findOne({
    $or: [{ name: req.body.name }, { description: req.body.description }],
  })
    .then((existingProduct) => {
      if (existingProduct) {
        return res.send(false);
      } else {
        let createdProduct = new Product({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          imgSrc: req.body.imgSrc,
        });

        if (req.body.price < 0) {
          return res.send(false);
        }

        if (
          !req.body.name ||
          !req.body.description ||
          !req.body.price ||
          !req.body.imgSrc
        ) {
          return res.send(false);
        }

        return createdProduct
          .save()
          .then(() => {
            return res.send(true);
          })
          .catch(() => {
            return res.send(false);
          });
      }
    })
    .catch(() => {
      return res.send(false);
    });
};

// This function retrieves all products.
module.exports.retrieveAllProducts = (req, res) => {
  return Product.find({})
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => res.send(err));
};

// This function retrieves all active products.
module.exports.allActiveProducts = (req, res) => {
  return Product.find({ isActive: true })
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => res.send(err));
};

// This function retrieves a single product.
module.exports.retrieveProduct = (req, res) => {
  return Product.findById(req.params.productId)
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => res.send(err));
};

// This function updates a product's information
module.exports.updateProduct = (req, res) => {
  // This code block captures the user input for the values of the properties that the user wishes to update.
  let updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imgSrc: req.body.imgSrc,
  };

  if (req.body.price <= 0) {
    return res.send(false);
  }

  if (!req.body.name || !req.body.description || !req.body.price) {
    return res.send(false);
  }

  return Product.findOne({
    $or: [{ name: req.body.name }, { description: req.body.description }],
    _id: { $ne: req.params.productId },
  })
    .then((existingProduct) => {
      if (existingProduct) {
        return res.send(false);
      }

      return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
        .then(() => {
          return res.send(true);
        })
        .catch(() => {
          return res.send(false);
        });
    })
    .catch(() => {
      return res.send(false);
    });
};

module.exports.archiveProduct = (req, res) => {
  return Product.findById(req.params.productId)
    .then((existingProduct) => {
      if (!existingProduct) {
        return res.send(false);
      } else if (!existingProduct.isActive) {
        return res.send(false);
      } else {
        return Product.findByIdAndUpdate(req.params.productId, {
          isActive: false,
        })
          .then(() => {
            return res.send(true);
          })
          .catch(() => {
            return res.send(false);
          });
      }
    })
    .catch(() => {
      return res.send(false);
    });
};

// This function activates a product.
module.exports.activateProduct = (req, res) => {
  return Product.findById(req.params.productId)
    .then((existingProduct) => {
      if (!existingProduct) {
        return res.send(false);
      } else if (existingProduct.isActive) {
        return res.send(false);
      } else {
        return Product.findByIdAndUpdate(req.params.productId, {
          isActive: true,
        })
          .then(() => {
            return res.send(true);
          })
          .catch(() => {
            return res.send(false);
          });
      }
    })
    .catch(() => {
      return res.send(false);
    });
};

module.exports.searchProductsByName = async (req, res) => {
  try {
    const { courseName } = req.body;

    const courses = await Product.find({
      name: { $regex: courseName, $options: "i" },
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
