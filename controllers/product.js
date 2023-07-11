// Imports required dependencies and modules.
const auth = require('../auth');
const Product = require("../models/Product");
const User = require('../models/User');
const Order = require("../models/Order");

// This function creates a product.
module.exports.createProduct = (req, res) => {
    let createdProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
    return createdProduct.save().then((product, error) => {
        if(error) {
            return res.send("Error, a new product is not created")
        } else {
            return res.send("Successful!, a new product is created.")
        }
    }).catch(err => res.send(err))
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




