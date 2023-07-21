// Imports required dependencies and modules.
const auth = require("../auth");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Order = require("../models/Order");

// This function checks if the user email provided already exists.
module.exports.checkEmailExists = (req, res) => {
	return User.find({email: req.body.email}).then(result => 
        {
            if(result.length > 0) {
                return res.send(true);
            } else {
                return res.send(false);
            }
	    }   
    )
};

// This function registers a unique user if a duplicate property is not found in the database.
module.exports.registerUser = (req, res) => {
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: bcrypt.hashSync(req.body.password, 10)
    });

    return newUser.save()
        .then((user) => {
            return res.json({access: true});
        })
        .catch((error) => {

            // This if statement checks if a duplicate property is found.
            if (error.code === 11000) {
                return res.json({access: false});
            } else {
                return res.send(error);
            }
        });
};

// This function is for logging in the user and for generating his/her own bearer/access token.
module.exports.loginUser = (req, res) => {
    return User.findOne({ email: req.body.email }).then(result => {
        if (result == null) {
            return res.send(false);
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

            if (isPasswordCorrect) {
                const accessToken = auth.createAccessToken(result);
                return res.json({ access: accessToken});
            } else {
                return res.send(false);
            }
        }
    }).catch(err => res.send(err));
};

// This function retrieves user details and hides the password for security.
module.exports.getUserDetails = (req, res) => {
	return User.findById(req.user.id).then(result => {
		result.password = "";
		return res.send(result)
	})
	.catch(err => res.send(err))
};

// This function is for resets the password of a registered user.
module.exports.resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id } = req.user;

        // This code block fetches the user's current password from the database.
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send(false);
        }

        // This code block compares the new password with the current password.
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).send(false);
        }

        // This code block hashes the new password.
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // This code block updates the user's password in the database.
        await User.findByIdAndUpdate(id, { password: hashedPassword });
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(false);
    }
};

// This function updates a non-admin user to an admin.
module.exports.updateToAdmin = (req, res) => {

	// This if statement checks if the # of characters of the objectId provided is equal to the standard random 24 characters generated by mongoDB
	if (req.body.id.length !== 24) {
		return res.send(false);
	}

    // This code block checks if the req.body.id property has no user input.
    return User.findById(req.body.id).then(result => {
        if (result == null) {
            return res.send(false);
        }

        if (result.isAdmin) {
            return res.send(false);
        } else {

            // This code block updates the user's isAdmin property.
            result.isAdmin = true; 

            // This code block saves the updated user to the database.
            return result.save().then(() => {
                return res.send(true);
            });
        }
    })
    .catch(err => res.send(err));
};

// This function retrieves the logged in user's orders.
module.exports.getOrders = (req, res) => {
    return User.findById(req.user.id)
        .then(result => {

            // This if statement checks if a user is an admin, returns false because an admin is prohibited from ordering.
            if (result.isAdmin) {
                return res.send(false);
            } else {
                Order.find({ userId: req.user.id })
                    .then((orders) => {

                        // This if statement checks if the user has an order
                        if (orders.length === 0) {
                            return res.send(false);
                        } else {
                            return res.send(orders);
                        }
                    })
                    .catch(err => res.send(err));
            }
        })
        .catch(err => res.send(err));
};