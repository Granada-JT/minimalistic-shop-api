// Dependencies and Modules
const auth = require("../auth");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Product = require("../models/Product")
const Order = require("../models/Order")

// Function for checking if user email already exists
module.exports.checkEmailExists = (req, res) => {
	return User.find({email: req.body.email}).then(result => 
        {
            if(result.length > 0) {
                return res.send("Email already exists");
            } else {
                return res.send("Email does not yet exist, you may proceed in registering");
            }
	    }   
    )
};

// User Registration Function
module.exports.registerUser = (req, res) => {
	let newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		mobileNo: req.body.mobileNo,
		password: bcrypt.hashSync(req.body.password, 10)
	})
	return newUser.save().then((user, error) => {
		if(error) {
			return false;
		} else {
			return res.send("Registered Successfully, Welcome shopper!")
		}
	}) .catch(err => res.send(err));
};

// User Authentication Function
module.exports.loginUser = (req, res) => {
	return User.findOne({email: req.body.email}).then(result => {
		console.log(result)
		if(result == null) {
			return false
		} else {
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

			if(isPasswordCorrect) {
				return res.send({access: auth.createAccessToken(result)})
			} else {
				return res.send(false);
			}
		}
	}).catch(err => res.send(err));
};
