const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    required: true
  },
  checkoutDate: {
    type: Date,
    default: new Date()
  },
  checkedOutItems: [{
    orderId: {
        type: String,
        ref: 'Order',
        required: [true, 'Order ID required']
    },
    productId: {
        type: String,
        ref: 'Product',
        required: [true, 'Product ID required']
    },
  }],
  priceToBePaid: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Checkout', checkoutSchema);