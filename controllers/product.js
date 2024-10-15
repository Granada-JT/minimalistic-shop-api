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
          .catch((error) => {
            console.error(error)
            return res.send(false);
          });
      }
    })
    .catch((error) => {
      console.error(error)
      return res.send(false);
    });
};

module.exports.retrieveAllProducts = (req, res) => {
  return Product.find({})
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => res.send(error));
};

module.exports.allActiveProducts = (req, res) => {
  return Product.find({ isActive: true })
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => res.send(error));
};

module.exports.retrieveProduct = (req, res) => {
  return Product.findById(req.params.productId)
    .then((result) => {
      return res.send(result);
    })
    .catch((error) => res.send(error));
};

module.exports.updateProduct = (req, res) => {
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
