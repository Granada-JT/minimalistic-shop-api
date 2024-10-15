const Cart = require("../models/Cart");
const Checkout = require("../models/Checkout");

module.exports.checkoutOrder = (req, res) => {
  Cart.findOne({
    "cartItems._id": req.body.cartItemId,
  })
    .then((cart) => {
      if (!cart) {
        return res.send("Cart not found");
      }

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
    .catch((error) => {
      console.error(error);
      return res.json(false);
    });
};
