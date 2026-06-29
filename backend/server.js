require("dotenv").config();

const express = require("express");

globalThis.crypto = globalThis.crypto || require("crypto").webcrypto;

const mongoose = require("mongoose");

const app = express();

const routes = require("./index");

app.use(express.json({ limit: "2mb" }));

mongoose.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDB Connected");
	})
	.catch((err) => {
		console.log(err);
	});

app.use("/api", routes.router);

const PORT = process.env.PORT || '4000';

app.listen(PORT, () => {
	console.log(`Server running on Port ${PORT}`);
});
