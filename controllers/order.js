// Imports the required dependencies and modules.
const auth = require('../auth');
const Order = require("../models/Order");
const User = require('../models/User');
const Product = require("../models/Product");

// This function finds if a product name provided by the user matches a product name in the database and if the product is active, if a match is found and a quantity is provided it will then create an order.
module.exports.createOrder = (req, res) => {
    Product.findOne({ name: req.body.productName, isActive: true}).then(product => {
        if (!product) {
            return res.send("Product is not available");
        }

        // This if statement checks if there is a user input for the quantity property.
        if (!req.body.quantity) {
            return res.send(`The ${product.name} is available. Please provide how many you will order. Thank you!`);
        }

        // This if statement checks if the user is an admin or not
        if (req.user.isAdmin) {
            return res.send("Cannot place an order, admins are not allowed to place an order.");
        }

        const order = new Order({
            userId: req.user.id,
            products: [{
                productId: product.id,
                // The user will input how many product/s needs to be ordered.
                quantity: req.body.quantity,
                productName: product.name
            }],
            // The price of the product will be multiplied to the inputted quantity to get the total amount.
            totalAmount: product.price*req.body.quantity
        });

        return order.save().then((order, error) => {
            if (error) {
                return res.send("Error, the order was not created");
            } else {
                return res.send(`Successful!, The "${product.name}" is available, order created. Thank you!, Here is a summary of your order:
                ${order}`);
            }
        }).catch(err => res.send(err));
    });
};

// This function retrieves all orders/
module.exports.getAllOrders = (req, res) => {
    
    return Order.find({}).then((orders) => {
        // Calculate the total number of unique users in the orders array
        const uniqueUsers = [...new Set(orders.map(order => order.userId))].length;

        // Calculate the total product quantity
        const totalQuantity = orders.reduce((sum, order) => {
            return sum + order.products.reduce((productSum, product) => {
             return productSum + (product.quantity || 0);
            }, 0);

        }, 0);

        // Calculate the total amount for all orders
        const totalAmount = orders.reduce((sum, order) => {
            return sum + order.totalAmount;
        }, 0);

        return res.send(
            `Total number of orders: ${orders.length} \n Total number of unique users who placed an order: ${uniqueUsers} \n Total product quantity: ${totalQuantity} \n Total amount for all the orders: ${totalAmount}
            \n All Orders: \n ${orders}`
        );

    }).catch(err => res.send(err));

};









