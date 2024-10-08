const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

	name: {
		type: String,
		required: [true, 'Course name is required.']
	},
	description: {
		type: String,
		required: [true, 'Description is required.']
	},
	price: {
		type: Number,
		required: [true, 'Course Price is required']
	},
	isActive: {
		type: Boolean,
		default: true
	},
	imgSrc: {
		type: String,
    	required: [true, 'Image source is required.']
	},
	createdOn: {
		type: Date,
		default: new Date()
	},
});

module.exports = mongoose.model('Product', productSchema);