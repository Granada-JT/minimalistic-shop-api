const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET, {});
};

module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.send({ auth: "Failed. No Token received." });
  } else {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, function (error, decodedToken) {
    if (error) {
      return res.send({
        auth: "Failed",
        message: error.message,
      });
    } else {
      req.user = decodedToken;
      next();
    }
  });
};

module.exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message:
        "Authentication failed. You are not authorized to perform this action.",
    });
  }
};
