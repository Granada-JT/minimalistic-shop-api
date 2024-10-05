// Imports required dependencies and modules.
const Product = require("../models/Product");

// This function creates a product.
module.exports.createProduct = (req, res) => {
  // This method checks if a product with the same name or description already exists in the database.
  Product.findOne({
    $or: [{ name: req.body.name }, { description: req.body.description }],
  })
    .then((existingProduct) => {
      // This if statement prohibits the creation of a duplicate product. If an existing product is found.
      if (existingProduct) {
        return res.send(false);
      } else {
        // This code block captures user input for the product properties and assigns it to the new instance of the 'Product' model/schema.
        let createdProduct = new Product({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          imgSrc: req.body.imgSrc,
        });

        // This if statement prohibits the input/creation of a negative price.
        if (req.body.price < 0) {
          return res.send(false);
        }

        // This if statement checks if there are no or falsy user input for the properties.
        if (
          !req.body.name ||
          !req.body.description ||
          !req.body.price ||
          !req.body.imgSrc
        ) {
          return res.send(false);
        }

        // This method saves the newly created product to the database.
        return createdProduct
          .save()
          .then((product) => {
            return res.send(true);
          })
          .catch((err) => {
            return res.send(false);
          });
      }

      // This method catches the error if an error occurs during the duplicate check.
    })
    .catch((err) => {
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

  // This if statement checks if the provided price is negative.
  if (req.body.price <= 0) {
    return res.send(false);
  }

  // This if statement checks if there are no or falsy user input for the properties.
  if (!req.body.name || !req.body.description || !req.body.price) {
    return res.send(false);
  }

  // This method checks for a duplicate name, description, and price.
  return Product.findOne({
    $or: [{ name: req.body.name }, { description: req.body.description }],
    _id: { $ne: req.params.productId },
  })
    .then((existingProduct) => {
      if (existingProduct) {
        return res.send(false);
      }

      // This method updates the product in the database.
      return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
        .then(() => {
          return res.send(true);
        })
        .catch((err) => {
          return res.send(false);
        });
    })
    .catch((err) => {
      return res.send(false);
    });
};

// This function archives a product.
module.exports.archiveProduct = (req, res) => {
  return Product.findById(req.params.productId)
    .then((existingProduct) => {
      // This if statement checks if the product exists in the database.
      if (!existingProduct) {
        return res.send(false);
      }

      // This else if statement checks if the product is already archived.
      else if (!existingProduct.isActive) {
        return res.send(false);
      }

      // This else statement archives the product if the product is not yet archived.
      else {
        return Product.findByIdAndUpdate(req.params.productId, {
          isActive: false,
        })
          .then(() => {
            return res.send(true);
          })
          .catch((err) => {
            return res.send(false);
          });
      }

      // This method catches an error if it occurs during the find operation.
    })
    .catch((err) => {
      return res.send(false);
    });
};

// This function activates a product.
module.exports.activateProduct = (req, res) => {
  return Product.findById(req.params.productId)
    .then((existingProduct) => {
      // This if statement checks if the product exists in the database.
      if (!existingProduct) {
        return res.send(false);
      }

      // This else if statement checks if the product is already activated.
      else if (existingProduct.isActive) {
        return res.send(false);
      }

      // This else if statement and method updates the product's isActive property to true to activate it.
      else {
        return Product.findByIdAndUpdate(req.params.productId, {
          isActive: true,
        })
          .then(() => {
            return res.send(true);
          })
          .catch((err) => {
            return res.send(false);
          });
      }

      // This method catches an error if it occurs during the find operation.
    })
    .catch((err) => {
      return res.send(false);
    });
};

module.exports.searchProductsByName = async (req, res) => {
  try {
    const { courseName } = req.body;

    // Use a regular expression to perform a case-insensitive search
    const courses = await Course.find({
      name: { $regex: courseName, $options: "i" },
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
