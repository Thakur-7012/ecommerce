require('dotenv').config();

const express = require('express');

const router = express.Router();

const product = require('./routes/product');
const user = require('./routes/user');

router.use('/products', product.router);
router.use('/users', user.router);

module.exports = {
	router
};
