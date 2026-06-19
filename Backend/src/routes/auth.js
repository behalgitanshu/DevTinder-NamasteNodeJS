const express = require("express");
const User = require("../model/user");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const router = express.Router();

// Sign up API
router.post("/signup", async (req, res) => {
	try {
		// Validate request body
		const validationResult = validateSignupData(req.body);
		if (!validationResult.valid) {
			return res.status(400).json({ message: validationResult.message });
		}

		// Encrypt password before saving to database
		const { password } = req.body;
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		req.body.password = hashedPassword;

		// Create and save user to database
		const user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			age: req.body.age,
			gender: req.body.gender,
			interests: req.body.interests,
			profilePictureURL: req.body.profilePictureURL,
			aboutMe: req.body.aboutMe,
		});
		await user.save();
		res.status(201).json({ message: "User signed up successfully", user });
	} catch (err) {
		res.status(500).json({ message: "Error signing up", error: err.message });
	}
});

// Login API
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(500).json({ message: "Invalid login" });
		}
		const passwordMatch = await user.validatePassword(password);
		if (!passwordMatch) {
			return res.status(401).json({ message: "Invalid login" });
		}

		// Create a JWT token here for authentication
		const token = await user.getJWT();

		// Add token to cookie and send response
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
		res.json({ message: "Login successful", user });
	} catch (err) {
		res.status(500).json({ message: "Error logging in", error: err.message });
	}
});

// Logout API
router.post("/logout", (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
