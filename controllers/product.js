// Imports required dependencies and modules.
const auth = require('../auth');
const Product = require("../models/Product");
const User = require('../models/User');
const Order = require("../models/Order");

// This function creates a product.
module.exports.createProduct = (req, res) => {

    // Check if a product with the same name or description already exists in the database.
    Product.findOne({ $or: [{ name: req.body.name }, { description: req.body.description }] }).then(existingProduct => {
        if (existingProduct) {
            return res.send(false);
        } else {

            // Create a new product with the provided details.
            let createdProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            });

            // Checks if the provided price is negative.
            if (req.body.price < 0) {
                return res.send(false);
            }

            // Checks if there are no user input for the properties.
            if (!req.body.name || !req.body.description || !req.body.price) {
                return res.send(false);
            }

            // Save the newly created product to the database.
            return createdProduct.save().then(product => {
                return res.send(true);
            }).catch(err => {
                return res.send(false);
            });
        }
    }).catch(err => {

        // Catch the error if an error occurs during the duplicate check.
        return res.send(false);
    });
};


// This function retrieves all products.
module.exports.retrieveAllProducts = (req,res) => {
    return Product.find({}).then(result => {
        return res.send(result)
    })
    .catch(err => res.send(err))
};

// This function retrieves all active products.
module.exports.allActiveProducts = (req,res) => {
    return Product.find({isActive: true}).then(result => {
        return res.send(result)
    })
    .catch(err => res.send(err))
};

// This function retrieves a single product.
module.exports.retrieveProduct = (req, res) => {
    return Product.findById(req.params.productId).then(result => {
        return res.send(result)
    })
    .catch(err => res.send(err))
}

// This function updates a product's information
module.exports.updateProduct = (req, res) => {
    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    // Checks if the provided price is negative.
    if (req.body.price < 0) {
        return res.send(false);
    } 

    // Checks if there are no user input for the properties.
    if (!req.body.name || !req.body.description || !req.body.price) {
        return res.send(false);
    }

    // Checks for duplicate name, description, and price
    return Product.findOne({
        $or: [
            { name: req.body.name },
            { description: req.body.description },
            { price: req.body.price }
        ],
        _id: { $ne: req.params.productId }
    }).then(existingProduct => {
        if (existingProduct) {
            return res.send(false);
        }

        return Product.findByIdAndUpdate(req.params.productId, updatedProduct).then(() => {
            return res.send(true);
        }).catch(err => {
            return res.send(false);
        });
    }).catch(err => {
        return res.send(false);
    });
};

// This function archives a product.
module.exports.archiveProduct = (req, res) => {
    return Product.findById(req.params.productId).then(existingProduct => {
        
        // Checks if the product exists in the database.
        if (!existingProduct) {
            return res.send(false);
        } 

        // Checks if the product is already archived.
        else if (!existingProduct.isActive) {
            return res.send(false);
        } 
        
        else {

            // Update the product's isActive property to false to archive it.
            return Product.findByIdAndUpdate(req.params.productId, { isActive: false }).then(() => {
                return res.send(true);

            }).catch(err => {
                return res.send(false);
            });
        }
    }).catch(err => {

        // If an error occurs during the find operation, send a response with the error message.
        return res.send(false);

    });
};


// This function activates a product.
module.exports.activateProduct = (req, res) => {
    return Product.findById(req.params.productId).then(existingProduct => {
        
        // Checks if the product exists in the database.
        if (!existingProduct) {
            return res.send(false);
        } 

        // Checks if the product is already activated.
        else if (existingProduct.isActive) {
            return res.send(false);
        } 
        
        else {

            // Update the product's isActive property to true to activate it.
            return Product.findByIdAndUpdate(req.params.productId, { isActive: true }).then(() => {
                return res.send(true);

            }).catch(err => {
                return res.send(false);
            });
        }
    }).catch(err => {

        // Catch the error if an error occurs during the find operation.
        return res.send(false);

    });
}








