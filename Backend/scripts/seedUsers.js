// Signs up mock users against a running Codemate backend via the /signup API.
// Usage: node scripts/seedUsers.js [count] [baseUrl]
const { generateMockUsers } = require("./mockUsers");

const count = parseInt(process.argv[2], 10) || 200;
const baseUrl = process.argv[3] || process.env.BASE_URL || "http://localhost:3000";

const BATCH_SIZE = 10;

const signupUser = async (user) => {
	const res = await fetch(`${baseUrl}/signup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(user),
	});

	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || `HTTP ${res.status}`);
	}
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
	const users = generateMockUsers(count);
	let succeeded = 0;
	let failed = 0;

	console.log(`Signing up ${users.length} mock users against ${baseUrl} ...`);

	for (let i = 0; i < users.length; i += BATCH_SIZE) {
		const batch = users.slice(i, i + BATCH_SIZE);

		const results = await Promise.allSettled(batch.map(signupUser));

		results.forEach((result, idx) => {
			if (result.status === "fulfilled") {
				succeeded++;
			} else {
				failed++;
				console.error(
					`Failed: ${batch[idx].email} — ${result.reason.message}`,
				);
			}
		});

		console.log(`Progress: ${Math.min(i + BATCH_SIZE, users.length)}/${users.length}`);
		await sleep(100);
	}

	console.log(`Done. Signed up: ${succeeded}, Failed: ${failed}`);
};

run().catch((err) => {
	console.error("Seed script crashed:", err);
	process.exit(1);
});
