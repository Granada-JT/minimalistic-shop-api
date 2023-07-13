const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

  userId: {
      type: String,
      ref: 'User',
      required: [true, 'User ID required']
  },
  cartItems: [{
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
      price: {
          type: Number, 
          required: [true, 'Price is required']
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required']
      },
      subTotal: {
        type: Number,
        required: [true, 'Sub Total amount is required']
      },
  }],
  totalPrice: {
    type: Number,
    required: [true, 'Total amount is required']
  },
	addedOn: {
		type: Date,
		default: new Date()
	},

});
module.exports = mongoose.model('Cart', cartSchema);