const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.post("/addProduct", async (req, res) => {
	try {
		const product = new Product(req.body);

		await product.save();

		res.status(201).json({
			success: true,
			message: "Product Added Successfully",
			data: product
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message
		});
	}
});

router.get("/getProducts", async (req, res) => {
	try {
		const products = await Product.find();

		res.status(200).json({
			success: true,
			count: products.length,
			data: products
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

router.get("/getProduct/:id", async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product Not Found"
			});
		}

		res.status(200).json({
			success: true,
			data: product
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

router.put("/updateProduct/:id", async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product Not Found"
			});
		}

		res.status(200).json({
			success: true,
			message: "Product Updated Successfully",
			data: product
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message
		});
	}
});

router.delete("/deleteProduct/:id", async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product Not Found"
			});
		}

		res.status(200).json({
			success: true,
			message: "Product Deleted Successfully"
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

module.exports = { router };
