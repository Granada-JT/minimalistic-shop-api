// Imports the required dependencies and modules.
const auth = require('../auth');
const Order = require("../models/Order");
const User = require('../models/User');
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// This function will automatically add user's order into the cart
module.exports.addToCart = (req, res) => {
    const userId = req.user.id;

    // Find the orderIds based on the userId
    Order.find({ userId: userId })
      .then((orders) => {
        if (orders.length === 0) {
          return res.send("No orders found for the user");
        }
  
        const orderIds = orders.map((order) => order._id);
  
        const cartItems = [];
  
        Promise.all(
          orderIds.map((orderId) =>
            Order.findById(orderId)
              .populate('products.productId')
              .then((order) => {
                if (!order) {
                  return res.send("Order not found");
                }
  
                const product = order.products[0].productId;
                const quantity = order.products[0].quantity;
                const cartItem = {
                  orderId: order._id,
                  productId: product._id,
                  quantity: quantity,
                  price: product.price,
                  subTotal: product.price * quantity
                };
  
                cartItems.push(cartItem);
              })
              .catch((err) => {
                console.error(err);
                res.status(500).send(false);
              })
          )
        )
          .then(() => {
            const cart = new Cart({
              userId: userId,
              cartItems: cartItems,
              totalPrice: calculateTotalPrice(cartItems)
            });
  
            return cart.save().then(() => {
              res.send(true);
            });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send(false);
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(false);
      });
  
};
  
// This helper function calculates the total price from the cart items
function calculateTotalPrice(cartItems) {
let totalPrice = 0;
for (const cartItem of cartItems) {
    totalPrice += cartItem.subTotal;
}
return totalPrice;
};

// This function changes a specific product's quantity in the cart.
module.exports.changeQuantity = (req, res) => {
    const userId = req.user.id;
    const productId = req.body.productId;
    const newQuantity = req.body.quantity;

    // This code block checks if the cart exists in the database.
    Cart.findOne({ userId: userId })
        .then((cart) => {
            if (!cart) {
                return res.send(false);
            }

            const cartItem = cart.cartItems.find(item => item.productId === productId);

            // This if statement checks if there are no products found on the cart.
            if (!cartItem) {
                return res.send(false);
            }

            // This code block finds the product within the cart item instead of querying the entire database.
            const productPrice = cartItem.price;
            const product = cartItem.productId;

            if (!product) {
                return res.send(false);
            }

            cartItem.quantity = newQuantity;
            console.log(productPrice);
            cartItem.subTotal = productPrice * newQuantity;

            cart.totalPrice = calculateTotalPrice(cart.cartItems);

            return cart.save().then(() => {
                res.send(true);
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(false);
        });
};