const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	description: {
		type: String,
		trim: true,
		default: ""
	},
	price: {
		type: Number,
		required: true
	},
	category: {
		type: String,
		trim: true,
		required: true
	},
	brand: {
		type: String,
		trim: true,
		default: ""
	},
	image: {
		type: String,
		trim: true,
		default: ""
	},
	stock: {
		type: Number,
		default: 0
	},
	rating: {
		type: Number,
		default: 0
	},
	isActive: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
