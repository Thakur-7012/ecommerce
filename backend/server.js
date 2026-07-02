require("dotenv").config();

const express = require("express");

globalThis.crypto = globalThis.crypto || require("crypto").webcrypto;

const mongoose = require("mongoose");
const Logger = require("./utils/logger");
const requestLogger = require("./middlewares/logger");

const app = express();
const logger = new Logger(module);

const routes = require("./index");

app.use(requestLogger);
app.use(express.json({ limit: "2mb" }));

mongoose.connect(process.env.MONGO_URI)
	.then(() => {
		logger.info("MongoDB Connected");
	})
	.catch((err) => {
		logger.error(err);
	});

app.use("/api", routes.router);

app.use((err, req, res, next) => {
	logger.error(err);
	res.status(500).json({
		success: false,
		message: "Internal server error"
	});
});

const PORT = process.env.PORT || '4000';

app.listen(PORT, () => {
	logger.info(`Server running on Port ${PORT}`);
});
