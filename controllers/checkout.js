const Cart = require("../models/Cart");
const Checkout = require("../models/Checkout");

// Checkout Function
module.exports.checkoutOrder = (req, res) => {
  Cart.findOne({
    "cartItems._id": req.body.cartItemId,
  })
    .then((cart) => {
      if (!cart) {
        return res.send("Cart not found");
      }

      // This if statement checks if the user is an admin or not, if an admin is detected, he/she will not be allowed to create an order.
      if (req.user.isAdmin) {
        return res.send(false);
      }

      const cartItem = cart.cartItems.find(
        (item) => item._id.toString() === req.body.cartItemId,
      );

      if (!cartItem) {
        return res.send("CartItem not found");
      }

      const checkout = new Checkout({
        userId: req.user.id,
        isPaid: false,
        paymentMethod: req.body.paymentMethod,
        checkoutDate: new Date(),
        checkedOutItems: [
          {
            orderId: cartItem.orderId,
            productId: cartItem.productId,
          },
        ],
        priceToBePaid: cartItem.subTotal,
      });

      return checkout
        .save()
        .then(() => {
          return res.json(true);
        })
        .catch((error) => {
          console.error(error);
          return res.json(false);
        });
    })
    .catch((err) => {
      console.error(err);
      return res.json(false);
    });
};
