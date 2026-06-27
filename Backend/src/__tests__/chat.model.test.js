const mongoose = require("mongoose");
const { connect, closeDatabase, clearDatabase } = require("../test-utils/testDb");
const Chat = require("../model/chat");

beforeAll(connect);
afterEach(clearDatabase);
afterAll(closeDatabase);

describe("Chat model", () => {
	const userA = new mongoose.Types.ObjectId();
	const userB = new mongoose.Types.ObjectId();

	it("auto-generates a sorted, order-independent roomId from participants", async () => {
		const chat = await new Chat({ participants: [userA, userB] }).save();
		expect(chat.roomId).toBe(Chat.getRoomId(userA, userB));
		expect(chat.roomId).toBe(Chat.getRoomId(userB, userA));
	});

	it("requires exactly 2 participants", async () => {
		await expect(
			new Chat({ participants: [userA] }).save(),
		).rejects.toThrow();
	});

	it("enforces a unique roomId so re-saving the same pair reuses the chat", async () => {
		await new Chat({ participants: [userA, userB] }).save();
		await expect(
			new Chat({ participants: [userB, userA] }).save(),
		).rejects.toThrow();
	});

	it("stores messages with sender and text", async () => {
		const chat = await new Chat({
			participants: [userA, userB],
			messages: [{ senderId: userA, text: "hello" }],
		}).save();

		expect(chat.messages).toHaveLength(1);
		expect(chat.messages[0].text).toBe("hello");
		expect(chat.messages[0].senderId.toString()).toBe(userA.toString());
	});
});
