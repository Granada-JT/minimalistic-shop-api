const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    userId: {
        type: String,
        ref: 'User',
        required: [true, 'User ID required']
      },
    products: [
		{
			productId: {
				type: String,
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

module.exports = mongoose.model('Order', orderSchema);