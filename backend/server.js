const express = require("express");

globalThis.crypto = globalThis.crypto || require("crypto").webcrypto;

const mongoose = require("mongoose");

const app = express();

const routes = require("./index");

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
	.then(() => {
		console.log("MongoDB Connected");
	})
	.catch((err) => {
		console.log(err);
	});

app.use("/api", routes.router);

app.listen(4000, () => {
	console.log("Server running on Port 4000");
});
