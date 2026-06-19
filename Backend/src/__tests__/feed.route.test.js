const request = require("supertest");
const app = require("../app");
const testDb = require("../test-utils/testDb");
const { createTestUser } = require("../test-utils/testHelpers");

beforeAll(async () => {
	await testDb.connect();
}, 60000);

afterEach(async () => {
	await testDb.clearDatabase();
});

afterAll(async () => {
	await testDb.closeDatabase();
});

describe("GET /user/feed", () => {
	it("excludes the logged-in user themselves", async () => {
		const { token } = await createTestUser();

		const res = await request(app)
			.get("/user/feed")
			.set("Cookie", [`token=${token}`]);

		expect(res.status).toBe(200);
		expect(res.body.data).toEqual([]);
	});

	it("excludes a user that I already acted on", async () => {
		const { user: me, token } = await createTestUser();
		const { user: other } = await createTestUser();

		await request(app)
			.post(`/request/send/ignore/${other._id}`)
			.set("Cookie", [`token=${token}`])
			.send({});

		const res = await request(app)
			.get("/user/feed")
			.set("Cookie", [`token=${token}`]);

		expect(res.body.data.map((u) => u._id)).not.toContain(other._id.toString());
	});

	// Regression test: someone who sent ME a pending request used to be
	// hidden from my own feed before I ever got a chance to react to them,
	// which made it impossible to ever reach a mutual match through the UI.
	it("keeps a user visible who sent me a pending request I haven't acted on", async () => {
		const { user: me, token: myToken } = await createTestUser();
		const { user: other, token: otherToken } = await createTestUser();

		await request(app)
			.post(`/request/send/interested/${me._id}`)
			.set("Cookie", [`token=${otherToken}`])
			.send({});

		const res = await request(app)
			.get("/user/feed")
			.set("Cookie", [`token=${myToken}`]);

		expect(res.body.data.map((u) => u._id)).toContain(other._id.toString());
	});

	it("excludes a user once the connection is resolved (accepted)", async () => {
		const { user: userA, token: tokenA } = await createTestUser();
		const { user: userB, token: tokenB } = await createTestUser();

		await request(app)
			.post(`/request/send/interested/${userB._id}`)
			.set("Cookie", [`token=${tokenA}`])
			.send({});
		await request(app)
			.post(`/request/send/interested/${userA._id}`)
			.set("Cookie", [`token=${tokenB}`])
			.send({});

		const feedA = await request(app)
			.get("/user/feed")
			.set("Cookie", [`token=${tokenA}`]);
		const feedB = await request(app)
			.get("/user/feed")
			.set("Cookie", [`token=${tokenB}`]);

		expect(feedA.body.data.map((u) => u._id)).not.toContain(userB._id.toString());
		expect(feedB.body.data.map((u) => u._id)).not.toContain(userA._id.toString());
	});
});

describe("GET /user/matches", () => {
	it("returns only accepted connections", async () => {
		const { user: userA, token: tokenA } = await createTestUser();
		const { user: userB, token: tokenB } = await createTestUser();
		const { user: userC } = await createTestUser();

		await request(app)
			.post(`/request/send/interested/${userB._id}`)
			.set("Cookie", [`token=${tokenA}`])
			.send({});
		await request(app)
			.post(`/request/send/interested/${userA._id}`)
			.set("Cookie", [`token=${tokenB}`])
			.send({});
		await request(app)
			.post(`/request/send/ignore/${userC._id}`)
			.set("Cookie", [`token=${tokenA}`])
			.send({});

		const res = await request(app)
			.get("/user/matches")
			.set("Cookie", [`token=${tokenA}`]);

		expect(res.body.data).toHaveLength(1);
		expect(res.body.data[0]._id).toBe(userB._id.toString());
	});
});
