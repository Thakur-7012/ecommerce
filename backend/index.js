const express = require("express");

const router = express.Router();

const product = require("./routes/product");

router.use("/product", product.router);

module.exports = { router };