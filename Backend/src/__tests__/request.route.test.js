const request = require("supertest");
const app = require("../app");
const testDb = require("../test-utils/testDb");
const { createTestUser } = require("../test-utils/testHelpers");
const ConnectionRequest = require("../model/connectionRequest");

beforeAll(async () => {
	await testDb.connect();
}, 60000);

afterEach(async () => {
	await testDb.clearDatabase();
});

afterAll(async () => {
	await testDb.closeDatabase();
});

describe("POST /request/send/:status/:receiverId", () => {
	it("creates a new pending request", async () => {
		const { user: sender, token } = await createTestUser();
		const { user: receiver } = await createTestUser();

		const res = await request(app)
			.post(`/request/send/interested/${receiver._id}`)
			.set("Cookie", [`token=${token}`])
			.send({});

		expect(res.status).toBe(201);
		expect(res.body.status).toBe("interested");
		expect(res.body.connectionRequest.sender).toBe(sender._id.toString());
		expect(res.body.connectionRequest.receiver).toBe(receiver._id.toString());
	});

	it("rejects sending a request to yourself", async () => {
		const { user, token } = await createTestUser();

		const res = await request(app)
			.post(`/request/send/interested/${user._id}`)
			.set("Cookie", [`token=${token}`])
			.send({});

		expect(res.status).toBe(400);
		expect(res.body.message).toMatch(/cannot send a request to yourself/i);
	});

	it("rejects an invalid status value", async () => {
		const { token } = await createTestUser();
		const { user: receiver } = await createTestUser();

		const res = await request(app)
			.post(`/request/send/bogus/${receiver._id}`)
			.set("Cookie", [`token=${token}`])
			.send({});

		expect(res.status).toBe(400);
		expect(res.body.message).toMatch(/Invalid status/i);
	});

	it("rejects a duplicate same-direction request", async () => {
		const { token } = await createTestUser();
		const { user: receiver } = await createTestUser();

		await request(app)
			.post(`/request/send/interested/${receiver._id}`)
			.set("Cookie", [`token=${token}`])
			.send({});

		const res = await request(app)
			.post(`/request/send/interested/${receiver._id}`)
			.set("Cookie", [`token=${token}`])
			.send({});

		expect(res.status).toBe(400);
		expect(res.body.message).toMatch(/already exists/i);
	});

	it("resolves mutual interest to 'accepted' (sequential)", async () => {
		const { user: userA, token: tokenA } = await createTestUser();
		const { user: userB, token: tokenB } = await createTestUser();

		await request(app)
			.post(`/request/send/interested/${userB._id}`)
			.set("Cookie", [`token=${tokenA}`])
			.send({});

		const res = await request(app)
			.post(`/request/send/interested/${userA._id}`)
			.set("Cookie", [`token=${tokenB}`])
			.send({});

		expect(res.status).toBe(200);
		expect(res.body.status).toBe("accepted");
		expect(res.body.message).toMatch(/match/i);

		const stored = await ConnectionRequest.findOne({});
		expect(stored.status).toBe("accepted");
	});

	it("resolves to 'rejected' when one side ignores", async () => {
		const { user: userA, token: tokenA } = await createTestUser();
		const { user: userB, token: tokenB } = await createTestUser();

		await request(app)
			.post(`/request/send/interested/${userB._id}`)
			.set("Cookie", [`token=${tokenA}`])
			.send({});

		const res = await request(app)
			.post(`/request/send/ignore/${userA._id}`)
			.set("Cookie", [`token=${tokenB}`])
			.send({});

		expect(res.status).toBe(200);
		expect(res.body.status).toBe("rejected");
	});

	// Regression test: two users marking each other "interested" at the exact
	// same time used to race past the existence check and create two separate
	// rows instead of resolving to a single "accepted" connection.
	it("resolves mutual interest to exactly one 'accepted' row under a concurrent race", async () => {
		const { user: userA, token: tokenA } = await createTestUser();
		const { user: userB, token: tokenB } = await createTestUser();

		const [resA, resB] = await Promise.all([
			request(app)
				.post(`/request/send/interested/${userB._id}`)
				.set("Cookie", [`token=${tokenA}`])
				.send({}),
			request(app)
				.post(`/request/send/interested/${userA._id}`)
				.set("Cookie", [`token=${tokenB}`])
				.send({}),
		]);

		const statuses = [resA.status, resB.status].sort();
		expect(statuses).toEqual([200, 201]);

		const allRequests = await ConnectionRequest.find({});
		expect(allRequests).toHaveLength(1);
		expect(allRequests[0].status).toBe("accepted");
	});
});
