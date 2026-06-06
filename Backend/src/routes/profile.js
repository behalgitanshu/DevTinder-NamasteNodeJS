const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../model/user");
const bcrypt = require("bcrypt");

const router = express.Router();

// View Profile API
router.get("/view", userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.status(200).json({ message: "Profile page", user });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching profile", error: err.message });
	}
});

// Edit Profile API
router.patch("/edit", userAuth, async (req, res) => {
	try {
		const user = req.user;
		const { name, email } = req.body;

		if (name) user.name = name;
		if (email) user.email = email;

		await user.save();
		res.status(200).json({ message: "Profile updated", user });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error updating profile", error: err.message });
	}
});

// Edit password API
router.patch("/password", userAuth, async (req, res) => {
	try {
		const user = req.user;
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res
				.status(400)
				.json({ message: "Current and new password are required" });
		}

		const isMatch = await user.comparePassword(currentPassword);
		if (!isMatch) {
			return res.status(401).json({ message: "Current password is incorrect" });
		}

		user.password = newPassword;
		await user.save();
		res.status(200).json({ message: "Password changed successfully" });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error changing password", error: err.message });
	}
});

module.exports = router;
