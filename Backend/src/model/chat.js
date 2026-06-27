const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			required: true,
			trim: true,
			maxLength: 1000,
		},
	},
	{ timestamps: true },
);

const chatSchema = new mongoose.Schema(
	{
		participants: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
			validate: {
				validator: (v) => v.length === 2,
				message: "A chat must have exactly 2 participants",
			},
		},
		// Order-independent identifier for the participant pair — computed the
		// same way as the frontend Socket.IO room id (getChatRoomId in
		// Frontend/src/utils/socket.js) and ConnectionRequest's pairKey, so a
		// chat document can be looked up directly by room id without scanning
		// `participants` in both directions.
		roomId: {
			type: String,
			required: true,
			unique: true,
		},
		messages: [messageSchema],
	},
	{ timestamps: true },
);

chatSchema.statics.getRoomId = (userId, otherUserId) =>
	[userId, otherUserId].map(String).sort().join("_");

chatSchema.pre("validate", function () {
	if (this.participants?.length === 2 && !this.roomId) {
		this.roomId = this.constructor.getRoomId(
			this.participants[0],
			this.participants[1],
		);
	}
});

module.exports = mongoose.model("Chat", chatSchema);
