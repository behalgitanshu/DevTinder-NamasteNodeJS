const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../model/chat");

const router = express.Router();

// GET /chat/:toUserId — returns the message history between the logged-in
// user and toUserId, keyed by the same roomId scheme used by the socket
// layer (sorted participant pair).
router.get("/:toUserId", userAuth, async (req, res) => {
	try {
		const { toUserId } = req.params;
		const roomId = Chat.getRoomId(req.user._id, toUserId);

		const chat = await Chat.findOne({ roomId });

		res.status(200).json({
			message: "Chat history",
			messages: chat?.messages || [],
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching chat history", error: err.message });
	}
});

module.exports = router;
