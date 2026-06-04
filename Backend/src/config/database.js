const mongoose = require("mongoose");

const connectDB = async () => {
	await mongoose.connect(
		"mongodb+srv://behalgitanshu:O3ZKplacc0IFlv4W@gibehal-db.muup3yb.mongodb.net/devTinder",
	);
};

module.exports = connectDB;
