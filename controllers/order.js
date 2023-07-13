// Imports the required dependencies and modules.
const Order = require("../models/Order");
const Product = require("../models/Product");

// This function finds if a product id provided by the user matches a product id in the database and if the product is active, if a match is found and a quantity is provided, it will then create an order.
module.exports.createOrder = (req, res) => {
    Product.findOne({ _id: req.body.productId, isActive: true}).then(product => {

        // This if statement checks if the product exists in the database.
        if (!product) {
            return res.send(false);
        }

        // This if statement checks if there is a user input for the quantity property.
        if (!req.body.quantity) {
            return res.send(false);
        }

        // This if statement checks if the user is an admin or not, if an admin is detected, he/she will not be allowed to create an order.
        if (req.user.isAdmin) {
            return res.send(false);
        }

        const order = new Order({
            userId: req.user.id,
            products: [{
                productId: product.id,

                // The user will input the number of product/s needs to be ordered.
                quantity: req.body.quantity,
                productName: product.name
            }],

            // The price of the product will be multiplied to the inputted quantity to get the total amount.
            totalAmount: product.price*req.body.quantity
        });

        // This return statement saves the newly created order to the database.
        return order.save().then((order, error) => {
            if (error) {
                return res.send(false);
            } else {
                return res.send(true);
            }
        }).catch(err => res.send(err));
    });
};

// This function retrieves all orders.
module.exports.getAllOrders = (req, res) => {
    
    return Order.find({}).then((orders) => {

        return res.send(orders);

    }).catch(err => res.send(err));

};