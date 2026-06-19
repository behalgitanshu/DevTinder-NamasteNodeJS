// Seeds random connection requests/matches between existing mock users
// (created by seedUsers.js), so the feed and connections pages have data
// to show beyond a single account. Writes directly to MongoDB via the
// Mongoose models, skipping the HTTP layer.
// Usage: node scripts/seedConnections.js [count]
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/database");
const User = require("../src/model/user");
const ConnectionRequest = require("../src/model/connectionRequest");

const count = parseInt(process.argv[2], 10) || 300;

// Weighted so a good chunk resolve into matches (visible in Connections tab)
// while still leaving a mix of pending and rejected requests.
const STATUSES = ["interested", "accepted", "accepted", "rejected"];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const run = async () => {
	await connectDB();
	console.log("Connected to MongoDB");

	const mockUsers = await User.find({
		email: { $regex: /@codemate-mock\.dev$/ },
	}).select("_id");

	if (mockUsers.length < 2) {
		console.error(
			"Need at least 2 mock users to seed connections. Run `npm run seed:users` first.",
		);
		process.exit(1);
	}

	console.log(
		`Seeding up to ${count} connection requests among ${mockUsers.length} mock users...`,
	);

	let created = 0;
	let skipped = 0;

	for (let i = 0; i < count; i++) {
		const sender = randomItem(mockUsers);
		const receiver = randomItem(mockUsers);

		if (sender._id.equals(receiver._id)) {
			skipped++;
			continue;
		}

		try {
			await ConnectionRequest.create({
				sender: sender._id,
				receiver: receiver._id,
				status: randomItem(STATUSES),
			});
			created++;
		} catch (err) {
			if (err.code === 11000) {
				// Duplicate pair (either direction already has a request) — skip.
				skipped++;
			} else {
				console.error(`Error creating request: ${err.message}`);
			}
		}
	}

	console.log(`Done. Created: ${created}, Skipped: ${skipped}`);
	await mongoose.connection.close();
};

run().catch((err) => {
	console.error("Seed script crashed:", err);
	process.exit(1);
});
