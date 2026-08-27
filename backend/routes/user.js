const express = require("express");

const router = express.Router();

const User = require("../models/user");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { verifyToken, authorizeRoles } = require("../middlewares/authentication");

router.post("/register", async (req, res) => {
	try {
		const { username, password, role } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				message: "Username and password are required"
			});
		}

		const existingUser = await User.findOne({ username });

		if (existingUser) {
			return res.status(409).json({
				message: "Username already exists"
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new User({
			username,
			password: hashedPassword,
			role
		});

		await user.save();

		res.status(201).json({
			message: "User registered successfully"
		});
	} catch (err) {
		res.status(500).json({
			message: "Registration failed",
			error: err.message
		});
	}
});

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				message: "Username and password are required"
			});
		}

		const user = await User.findOne({ username });

		if (!user) {
			return res.status(401).json({
				message: "Invalid username or password"
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({
				message: "Invalid username or password"
			});
		}

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
				role: user.role
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.json({
			message: "Login successful",
			token
		});
	} catch (err) {
		res.status(500).json({
			message: "Login failed",
			error: err.message
		});
	}
});

router.get("/user", verifyToken, authorizeRoles("user", "admin"), (req, res) => {
	res.json({ message: "Welcome user" });
});

router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
	res.json({ message: "welcome admin" });
});

module.exports = {
	router
};
