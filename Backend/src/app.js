const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./model/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

// API to add user to Database
app.post("/signup", async (req, res) => {
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
			profilePicture: req.body.profilePicture,
			aboutMe: req.body.aboutMe,
		});
		await user.save();
		res.status(201).json({ message: "User signed up successfully", user });
	} catch (err) {
		res.status(500).json({ message: "Error signing up", error: err.message });
	}
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(500).json({ message: "Invalid login" });
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ message: "Invalid login" });
		}
		res.json({ message: "Login successful", user });
	} catch (err) {
		res.status(500).json({ message: "Error logging in", error: err.message });
	}
});

// GET user by email
app.get("/user", async (req, res) => {
	const email = req.body.email;
	try {
		const user = await User.findOne({ email });
		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching user", error: err.message });
	}
});

// PATCH update user by email
app.patch("/user", async (req, res) => {
	const email = req.body.email;
	const updateData = req.body;
	console.log("Update data received:", updateData);
	try {
		const user = await User.findOneAndUpdate({ email }, updateData, {
			returnDocument: "after",
			runValidators: true,
		});
		if (user) {
			res.json({ message: "User updated successfully", user });
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error updating user", error: err.message });
	}
});

connectDB()
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(3000, () => {
			console.log("Server is running on port 3000");
		});
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err);
	});
