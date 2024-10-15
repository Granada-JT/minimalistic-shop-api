const Order = require("../models/Order");
const Product = require("../models/Product");

module.exports.createOrder = (req, res) => {
  Product.findOne({ _id: req.body.productId, isActive: true }).then(
    (product) => {
      if (!product) {
        return res.send(false);
      }

      if (!req.body.quantity) {
        return res.send(false);
      }

      if (req.user.isAdmin) {
        return res.send(false);
      }

      const order = new Order({
        userId: req.user.id,
        products: [
          {
            productId: product.id,
            quantity: req.body.quantity,
            productName: product.name,
          },
        ],

        totalAmount: product.price * req.body.quantity,
      });

      return order
        .save()
        .then((order, error) => {
          if (error) {
            return res.send(false);
          } else {
            return res.send(true);
          }
        })
        .catch((err) => res.send(err));
    },
  );
};

module.exports.getAllOrders = (req, res) => {
  return Order.find({})
    .then((orders) => {
      return res.send(orders);
    })
    .catch((err) => res.send(err));
};
