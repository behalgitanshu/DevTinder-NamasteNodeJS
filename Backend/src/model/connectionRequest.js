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
		// Order-independent identifier for the (sender, receiver) pair, used to
		// enforce at most one request document per pair regardless of direction —
		// the unique index on {sender, receiver} alone allows both directions to
		// exist simultaneously, which races two concurrent "interested" requests
		// into two rows instead of one resolving to "accepted".
		pairKey: {
			type: String,
		},
	},
	{ timestamps: true },
);

connectionRequestSchema.index({ pairKey: 1 }, { unique: true });

connectionRequestSchema.pre("save", async function () {
	if (this.sender.toString() === this.receiver.toString()) {
		throw new Error("Sender and receiver cannot be the same");
	}

	this.pairKey = [this.sender.toString(), this.receiver.toString()]
		.sort()
		.join("_");

	// Validate Both user ID are present in DB
	const User = mongoose.model("User");
	const senderExists = await User.exists({ _id: this.sender });
	const receiverExists = await User.exists({ _id: this.receiver });

	if (!senderExists || !receiverExists) {
		throw new Error("Sender or receiver does not exist");
	}
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
