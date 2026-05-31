const express = require("express");
const { adminAuth, userAuth } = require("./auth");

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Admin routes
app.use("/admin", adminAuth);

app.get("/admin/dashboard", (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard!" });
});

app.get("/admin/settings", (req, res) => {
  res.status(200).json({ message: "Here are the admin settings." });
});

app.get("/admin/users", (req, res) => {
  res.status(200).json({ message: "Here is the list of users." });
});

// User routes
app.get("/user/login", (req, res) => {
  res.status(200).json({ message: "Please log in to access your account." });
});

app.use("/user", userAuth);

app.get("/user/profile", (req, res) => {
  res.status(200).json({ message: "Here is your user profile." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
