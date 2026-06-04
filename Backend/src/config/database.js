const mongoose = require("mongoose");

const connectDB = async () => {
	await mongoose.connect(
		"mongodb+srv://behalgitanshu:REDACTED_PASSWORD@gibehal-db.muup3yb.mongodb.net/devTinder",
	);
};

module.exports = connectDB;
