const app = require("./app");
const connectDB = require("./config/database");

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
