// Imports the required dependencies and modules.
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// This function automatically adds a user's order into the cart.
module.exports.addToCart = (req, res) => {
  const userId = req.user.id;

  //This code block finds the orderIds based on their userId.
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

// This helper function calculates the total price from the cart items
function calculateTotalPrice(cartItems) {
  let totalPrice = 0;
  for (const cartItem of cartItems) {
    totalPrice += cartItem.subTotal;
  }
  return totalPrice;
}

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

      const cartItem = cart.cartItems.find(
        (item) => item.productId === productId,
      );

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

// This function removes a specific item from the cart with its associated order from the database by finding the provided productId.
module.exports.removeItem = (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.body.productId;

  // This code block finds if the cart exists based on the user ID.
  Cart.findOne({ userId: userId })
    .then((cart) => {
      if (!cart) {
        return res.send(false);
      }

      // This code block finds if the cart item or the product exists within the cart.
      const cartItemIndex = cart.cartItems.findIndex(
        (item) => item.productId === cartItemId,
      );
      if (cartItemIndex === -1) {
        return res.send(false);
      }

      // This code block removes the cart item from the cart.
      const removedCartItem = cart.cartItems.splice(cartItemIndex, 1)[0];

      // This code block removes the associated order from the database.
      return Order.findByIdAndRemove(removedCartItem.orderId)
        .then(() => {
          // This code block/function recalculates the total price.
          cart.totalPrice = calculateTotalPrice(cart.cartItems);

          // This method saves the updated cart document.
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

// This function retrieves the cart details from the database.
// This function retrieves the cart details from the database.
module.exports.getCart = (req, res) => {
  console.log("GET CART REQUEST RECEIVED");
  const userId = req.user.id;

  Cart.findOne({ userId })
    .sort({ addedOn: -1 })
    .populate("cartItems.productId")
    .exec()
    .then((cart) => {
      console.log("CART RETRIEVED FROM DATABASE:", cart);
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
