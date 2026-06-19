const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["ignore", "interested", "accepted", "rejected"],
			message: "Status must be one of: ignore, interested, accepted, rejected",
		},
	},
	{ timestamps: true },
);

connectionRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

connectionRequestSchema.pre("save", async function () {
	if (this.sender.toString() === this.receiver.toString()) {
		throw new Error("Sender and receiver cannot be the same");
	}

	// Validate Both user ID are present in DB
	const User = mongoose.model("User");
	const senderExists = await User.exists({ _id: this.sender });
	const receiverExists = await User.exists({ _id: this.receiver });

	if (!senderExists || !receiverExists) {
		throw new Error("Sender or receiver does not exist");
	}
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
