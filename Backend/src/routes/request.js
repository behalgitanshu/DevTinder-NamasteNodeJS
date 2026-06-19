const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");

const router = express.Router();

// Resolves a connection request found in the reverse direction (the other
// person already has a row for this pair). Returns the HTTP response body.
const resolveReverseRequest = async (existingRequest, incomingStatus) => {
	const resolvedStatus =
		existingRequest.status === "interested" && incomingStatus === "interested"
			? "accepted"
			: "rejected";

	existingRequest.status = resolvedStatus;
	await existingRequest.save();

	return {
		message: resolvedStatus === "accepted" ? "It's a match!" : "Connection rejected",
		status: resolvedStatus,
		connectionRequest: existingRequest,
	};
};

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

			const body = await resolveReverseRequest(existingRequest, status);
			return res.status(200).json(body);
		}

		// No prior request — store as new
		try {
			const connectionRequest = new ConnectionRequest({
				sender: senderId,
				receiver: receiverId,
				status,
			});
			await connectionRequest.save();

			return res.status(201).json({
				message: "Connection request sent successfully",
				status,
				connectionRequest,
			});
		} catch (saveError) {
			// Lost a race: the other user's request for this same pair was
			// inserted between our findOne check and our save. Re-fetch it and
			// resolve as a reverse request instead of erroring out.
			if (saveError.code === 11000) {
				const raceRequest = await ConnectionRequest.findOne({
					$or: [
						{ sender: senderId, receiver: receiverId },
						{ sender: receiverId, receiver: senderId },
					],
				});
				if (raceRequest) {
					const body = await resolveReverseRequest(raceRequest, status);
					return res.status(200).json(body);
				}
			}
			throw saveError;
		}
	} catch (error) {
		console.error("Error in /request/send:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
