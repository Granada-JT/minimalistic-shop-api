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
    return Product.findByIdAndUpdate(req.params.productId, updatedProduct).then((product, error) => {
        if(error) {
            return res.send("Error, the product's information was not updated")
        } else {
            return res.send("Successful!, the product's information was updated")
        }
    }).catch(err => res.send(err))    
}

// This function archives a product.
module.exports.archiveProduct = (req, res) => {
    return Product.findByIdAndUpdate(req.params.productId, {isActive: false}).then((product, error) => {
        if(error) {
            return res.send("Error, the product was not archived")
        } else {
            return res.send("Successful!, the product was archived")
        }
    }).catch(err => res.send(err))
}

// This function activates a product.
module.exports.activateProduct = (req, res) => {
    return Product.findByIdAndUpdate(req.params.productId, {isActive: true}).then((product, error) => {
        if(error) {
            return res.send("Error, the product was not activated")
        } else {
            return res.send("Successful!, the product was activated")
        }
    }).catch(err => res.send(err))
}








