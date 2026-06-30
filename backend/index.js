require('dotenv').config();

const express = require('express');

const router = express.Router();

const product = require('./routes/product');

router.use('/products', product.router);

module.exports = {
	router
};
