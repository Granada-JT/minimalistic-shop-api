// Mongoose Dependency
const mongoose = require('mongoose');

// User Model

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'First name is required.']
	},
	lastName: {
		type: String,
		required: [true, 'Last name is required.']
	},
	email: {
		type: String,
		required: [true, 'Email is required.']
	},
	password: {
		type: String,
		required: [true, 'Password is required.']
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	mobileNo: {
		type: String,
		required: [true, 'Mobile Number is required.']
	},
/* 	orders: [
		{
			orderId: {
				type: String,
				required: [true, 'Order ID is required.']
			},
			orderedOn: {
				type: Date,
				default: new Date()
			},
			status: {
				type: String,
				default: 'Enrolled'
			}
		}
	]
 */
});

module.exports = mongoose.model('User', userSchema);