const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Product = require('../models/product');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants/messages');

function sendSuccess(res, statusCode, payload = {}) {
	return res.status(statusCode).json({
		success: true,
		...payload
	});
}

function sendError(res, statusCode, message) {
	return res.status(statusCode).json({
		success: false,
		message
	});
}

function isValidObject(value) {
	return value && typeof value === 'object' && !Array.isArray(value);
}

function getErrorMessage(err, fallbackMessage) {
	return err.name === 'ValidationError' ? err.message : fallbackMessage;
}

function validateProductId(req, res, next) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return sendError(res, 400, ERROR_MESSAGES.INVALID_PRODUCT_ID);
	}

	next();
}

function validateProductPayload(req, res, next) {
	if (!isValidObject(req.body) || Object.keys(req.body).length === 0) {
		return sendError(res, 400, ERROR_MESSAGES.INVALID_PRODUCT_PAYLOAD);
	}

	next();
}

/**
 * Creates a product.
 * @returns {Product}
 */
const createProduct = async (req, res) => {
	try {
		const product = new Product(req.body);

		await product.save();

		sendSuccess(res, 201, {
			message: SUCCESS_MESSAGES.PRODUCT_CREATED,
			data: product
		});
	} catch (err) {
		sendError(res, 400, getErrorMessage(err, ERROR_MESSAGES.PRODUCT_CREATE_FAILED));
	}
};

/**
 * Gets all products.
 * @returns {Product[]}
 */
const getProducts = async (req, res) => {
	try {
		const products = await Product.find();

		sendSuccess(res, 200, {
			count: products.length,
			data: products
		});
	} catch (err) {
		sendError(res, 500, ERROR_MESSAGES.PRODUCT_FETCH_FAILED);
	}
};

/**
 * Gets a product by product id.
 * @param {string} id
 * @returns {Product}
 */
const getProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return sendError(res, 404, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
		}

		sendSuccess(res, 200, {
			data: product
		});
	} catch (err) {
		sendError(res, 500, ERROR_MESSAGES.PRODUCT_FETCH_FAILED);
	}
};

/**
 * Updates a product by product id.
 * @param {string} id
 * @returns {Product}
 */
const updateProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		if (!product) {
			return sendError(res, 404, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
		}

		sendSuccess(res, 200, {
			message: SUCCESS_MESSAGES.PRODUCT_UPDATED,
			data: product
		});
	} catch (err) {
		sendError(res, 400, getErrorMessage(err, ERROR_MESSAGES.PRODUCT_UPDATE_FAILED));
	}
};

/**
 * Deletes a product by product id.
 * @param {string} id
 * @returns {}
 */
const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (!product) {
			return sendError(res, 404, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
		}

		sendSuccess(res, 200, {
			message: SUCCESS_MESSAGES.PRODUCT_DELETED
		});
	} catch (err) {
		sendError(res, 500, ERROR_MESSAGES.PRODUCT_DELETE_FAILED);
	}
};

router.get('/', getProducts);
router.get('/:id', validateProductId, getProduct);

router.post('/', validateProductPayload, createProduct);

router.put('/:id', validateProductId, validateProductPayload, updateProduct);

router.delete('/:id', validateProductId, deleteProduct);

module.exports = {
	router
};
