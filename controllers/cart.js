const Order = require("../models/Order");
const Cart = require("../models/Cart");

module.exports.addToCart = (req, res) => {
  const userId = req.user.id;

  Order.find({ userId: userId })
    .then((orders) => {
      if (orders.length === 0) {
        return res.send(false);
      }

      const orderIds = orders.map((order) => order._id);

      const cartItems = [];

      Promise.all(
        orderIds.map((orderId) =>
          Order.findById(orderId)
            .populate("products.productId")
            .then((order) => {
              if (!order) {
                return res.send(false);
              }

              const product = order.products[0].productId;
              const quantity = order.products[0].quantity;
              const cartItem = {
                orderId: order._id,
                productId: product._id,
                quantity: quantity,
                price: product.price,
                subTotal: product.price * quantity,
              };

              cartItems.push(cartItem);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send(false);
            }),
        ),
      )
        .then(() => {
          const cart = new Cart({
            userId: userId,
            cartItems: cartItems,
            totalPrice: calculateTotalPrice(cartItems),
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

function calculateTotalPrice(cartItems) {
  let totalPrice = 0;
  for (const cartItem of cartItems) {
    totalPrice += cartItem.subTotal;
  }
  return totalPrice;
}

module.exports.changeQuantity = (req, res) => {
  const userId = req.user.id;
  const productId = req.body.productId;
  const newQuantity = req.body.quantity;

  Cart.findOne({ userId: userId })
    .then((cart) => {
      if (!cart) {
        return res.send(false);
      }

      const cartItem = cart.cartItems.find(
        (item) => item.productId === productId,
      );

      if (!cartItem) {
        return res.send(false);
      }

      const productPrice = cartItem.price;
      const product = cartItem.productId;

      if (!product) {
        return res.send(false);
      }

      cartItem.quantity = newQuantity;
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

module.exports.removeItem = (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.body.productId;

  Cart.findOne({ userId: userId })
    .then((cart) => {
      if (!cart) {
        return res.send(false);
      }

      const cartItemIndex = cart.cartItems.findIndex(
        (item) => item.productId === cartItemId,
      );
      if (cartItemIndex === -1) {
        return res.send(false);
      }

      const removedCartItem = cart.cartItems.splice(cartItemIndex, 1)[0];

      return Order.findByIdAndRemove(removedCartItem.orderId)
        .then(() => {
          cart.totalPrice = calculateTotalPrice(cart.cartItems);

          return cart.save();
        })
        .then(() => {
          res.send(true);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(false);
    });
};

module.exports.getCart = (req, res) => {
  const userId = req.user.id;

  Cart.findOne({ userId })
    .sort({ addedOn: -1 })
    .populate("cartItems.productId")
    .exec()
    .then((cart) => {
      if (!cart) {
        return res.send([]);
      }

      // Prevent caching for this specific API endpoint
      res.set("Cache-Control", "no-store");

      return res.json(cart);
    })
    .catch((err) => {
      console.error("ERROR GETTING CART:", err);
      res.status(500).send(false);
    });
};
