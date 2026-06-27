const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:5173",
		credentials: true,
	}),
);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/request");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

app.use("/", authRoutes);
app.use("/profile", profileRoutes);
app.use("/request", requestRoutes);
app.use("/health", healthRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

module.exports = app;
