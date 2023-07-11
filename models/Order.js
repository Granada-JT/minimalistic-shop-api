// Mongoose Dependency
const mongoose = require('mongoose');


// Schema/Blueprint
const courseSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID required']
      },
    products: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
				required: [true, 'Product ID is required']
			},
			quantity: {
				type: Number,
				default: 0
			}
		}
	],
	totalAmount: {
		type: Number,
		required: [true, 'Total amount is required']
	},
	purchasedOn: {
		type: Date,
		default: new Date()
	},

});
module.exports = mongoose.model('Course', courseSchema);