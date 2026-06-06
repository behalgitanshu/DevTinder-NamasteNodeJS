const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/request");
const userRoutes = require("./routes/user");

app.use("/", authRoutes);
app.use("/profile", profileRoutes);
app.use("/request", requestRoutes);
app.use("/health", healthRoutes);
app.use("/user", userRoutes);

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
