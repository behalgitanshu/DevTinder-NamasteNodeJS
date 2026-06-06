const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
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
		const validation = validateProfileEditData(req.body);
		if (!validation.valid) {
			return res.status(400).json({ message: validation.message });
		}

		const user = req.user;
		Object.assign(user, req.body);
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
		const allowedFields = ["currentPassword", "newPassword"];
		const extraFields = Object.keys(req.body).filter(
			(key) => !allowedFields.includes(key),
		);
		if (extraFields.length > 0) {
			return res.status(400).json({
				message: `Fields not allowed: ${extraFields.join(", ")}`,
			});
		}

		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res
				.status(400)
				.json({ message: "Current and new password are required" });
		}

		const user = req.user;

		const isMatch = await user.validatePassword(currentPassword);
		if (!isMatch) {
			return res.status(401).json({ message: "Current password is incorrect" });
		}

		user.password = await bcrypt.hash(newPassword, 10);
		await user.save({ validateBeforeSave: false });
		res.status(200).json({ message: "Password changed successfully" });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error changing password", error: err.message });
	}
});

module.exports = router;
