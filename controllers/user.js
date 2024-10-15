const auth = require("../auth");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Order = require("../models/Order");
const Checkout = require("../models/Checkout");

module.exports.checkEmailExists = (req, res) => {
  return User.find({ email: req.body.email }).then((result) => {
    if (result.length > 0) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  });
};

module.exports.registerUser = (req, res) => {
  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobileNo: req.body.mobileNo,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  return newUser
    .save()
    .then(() => {
      return res.json({ access: true });
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.json({ access: false });
      } else {
        return res.send(error);
      }
    });
};

module.exports.loginUser = (req, res) => {
  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (result == null) {
        return res.send(false);
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password,
        );

        if (isPasswordCorrect) {
          const accessToken = auth.createAccessToken(result);
          return res.json({ access: accessToken });
        } else {
          return res.send(false);
        }
      }
    })
    .catch((error) => res.send(error));
};

module.exports.getUserDetails = (req, res) => {
  return User.findById(req.user.id)
    .then((result) => {
      result.password = "";
      return res.send(result);
    })
    .catch((error) => res.send(error));
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send(false);
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).send(false);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send(false);
  }
};

module.exports.updateToAdmin = (req, res) => {
  if (req.body.id.length !== 24) {
    return res.send(false);
  }

  return User.findById(req.body.id)
    .then((result) => {
      if (result == null) {
        return res.send(false);
      }

      if (result.isAdmin) {
        return res.send(false);
      } else {
        result.isAdmin = true;

        return result.save().then(() => {
          return res.send(true);
        });
      }
    })
    .catch((error) => res.send(error));
};

module.exports.getOrders = (req, res) => {
  return User.findById(req.user.id)
    .then((result) => {
      if (result.isAdmin) {
        return res.send(false);
      } else {
        Order.find({ userId: req.user.id })
          .then((orders) => {
            if (orders.length === 0) {
              return res.send(false);
            } else {
              return res.send(orders);
            }
          })
          .catch((error) => res.send(error));
      }
    })
    .catch((error) => res.send(error));
};

module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, mobileNo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true },
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports.getCheckout = (req, res) => {
  return Checkout.findOne({
    userId: req.user.id,
  })
    .then((checkout) => {
      return res.json(checkout);
    })
    .catch((error) => {
      console.error(error);
      res.send(error);
    });
};
