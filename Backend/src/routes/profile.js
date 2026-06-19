const express = require("express");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const router = express.Router();

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = multer.diskStorage({
	destination: path.join(__dirname, "..", "..", "uploads", "profile-pictures"),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, `${req.user._id}-${crypto.randomUUID()}${ext}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
			return cb(new Error("Only JPEG, PNG, or WEBP images are allowed"));
		}
		cb(null, true);
	},
});

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

// Upload Profile Photo API
router.post(
	"/photo",
	userAuth,
	(req, res, next) => {
		upload.single("photo")(req, res, (err) => {
			if (err) {
				return res.status(400).json({ message: err.message });
			}
			next();
		});
	},
	async (req, res) => {
		try {
			if (!req.file) {
				return res.status(400).json({ message: "No photo file provided" });
			}

			const user = req.user;
			user.profilePictureURL = `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${req.file.filename}`;
			await user.save();

			res.status(200).json({ message: "Profile photo updated", user });
		} catch (err) {
			res.status(500).json({
				message: "Error uploading profile photo",
				error: err.message,
			});
		}
	},
);

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
