const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");

const router = express.Router();

// POST /request/send/:status/:receiverId
// Sends a connection request from the logged-in user to the receiver.
router.post("/send/:status/:receiverId", userAuth, async (req, res) => {
	try {
		const { status, receiverId } = req.params;
		const senderId = req.user._id;

		// Only ignore/interested allowed — accepted/rejected are system-resolved statuses
		if (!["ignore", "interested"].includes(status)) {
			return res
				.status(400)
				.json({ message: "Invalid status. Allowed: ignore, interested" });
		}

		// Prevent sending a request to yourself
		if (senderId.toString() === receiverId) {
			return res
				.status(400)
				.json({ message: "You cannot send a request to yourself" });
		}

		// Check if a request already exists in either direction
		const existingRequest = await ConnectionRequest.findOne({
			$or: [
				{ sender: senderId, receiver: receiverId },
				{ sender: receiverId, receiver: senderId },
			],
		});

		if (existingRequest) {
			const isReverseRequest =
				existingRequest.sender.toString() === receiverId.toString();

			if (!isReverseRequest) {
				// Same-direction duplicate — reject as bad request
				return res
					.status(400)
					.json({ message: "Connection request already exists" });
			}

			// Reverse request exists — resolve based on both sides' interest
			const resolvedStatus =
				existingRequest.status === "interested" && status === "interested"
					? "accepted"
					: "rejected";

			existingRequest.status = resolvedStatus;
			await existingRequest.save();

			return res.status(200).json({
				message:
					resolvedStatus === "accepted"
						? "It's a match!"
						: "Connection rejected",
				status: resolvedStatus,
				connectionRequest: existingRequest,
			});
		}

		// No prior request — store as new
		const connectionRequest = new ConnectionRequest({
			sender: senderId,
			receiver: receiverId,
			status,
		});
		await connectionRequest.save();

		res.status(201).json({
			message: "Connection request sent successfully",
			status,
			connectionRequest,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
