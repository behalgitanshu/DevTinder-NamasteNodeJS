const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
	try {
		// Read the token from the req cookies
		const { token } = req.cookies;
		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Validate the token
		const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
		if (!decodedMessage) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Fetch the user details from the database
		const id = decodedMessage.userId;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		req.user = user; // Attach user details to the request object for further use
		next();
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error authenticating user", error: err.message });
	}
};

module.exports = { userAuth };
