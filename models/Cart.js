const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    orderId: {
        type: String,
        ref: 'Order',
        required: [true, 'User ID required']
      },
    productId: {
        type: String,
        ref: 'Product',
        required: [true, 'Product ID required']
      },
	subTotal: {
		type: Number,
		required: [true, 'Sub Total amount is required']
	},
	placedOn: {
		type: Date,
		default: new Date()
	},

});
module.exports = mongoose.model('Cart', cartSchema);