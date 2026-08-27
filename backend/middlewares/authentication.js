const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			message: "Access denied. No token provided"
		});
	}

	const token = authHeader.split(" ")[1];

	try {
		const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
		console.log(verifiedUser);
		req.user = verifiedUser;
		next();
	} catch (err) {
		res.status(401).json({
			message: "Invalid token"
		});
	}
};

const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				message: "Access denied"
			});
		}

		next();
	};
};

module.exports = {
	verifyToken,
	authorizeRoles
};
