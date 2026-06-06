const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");

const userRoutes = express.Router();

const USER_SAFE_FIELDS =
	"firstName lastName age gender interests profilePictureURL aboutMe";

// GET /matches - Get all accepted connections for the logged-in user
userRoutes.get("/matches", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const connections = await ConnectionRequest.find({
			status: "accepted",
			$or: [{ sender: loggedInUser._id }, { receiver: loggedInUser._id }],
		}).populate("sender receiver", USER_SAFE_FIELDS);

		const matches = connections.map((conn) => {
			const other = conn.sender._id.equals(loggedInUser._id)
				? conn.receiver
				: conn.sender;
			return other;
		});

		res.status(200).json({ message: "Your matches", data: matches });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching matches", error: err.message });
	}
});

// GET /feed - Get a paginated list of users that the logged-in user has not interacted with
userRoutes.get("/feed", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;

		if (page < 1) page = 1;
		if (limit < 1 || limit > 50) limit = 10;

		const skip = (page - 1) * limit;

		const connections = await ConnectionRequest.find({
			$or: [{ sender: loggedInUser._id }, { receiver: loggedInUser._id }],
		}).select("sender receiver");

		const excludedIds = new Set([loggedInUser._id.toString()]);
		connections.forEach((conn) => {
			excludedIds.add(conn.sender.toString());
			excludedIds.add(conn.receiver.toString());
		});

		const User = require("../model/user");
		const feedUsers = await User.find({ _id: { $nin: [...excludedIds] } })
			.select(USER_SAFE_FIELDS)
			.skip(skip)
			.limit(limit);

		res.status(200).json({ message: "Your feed", data: feedUsers });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching feed", error: err.message });
	}
});

// Cursor-based feed: GET /feed/cursor?limit=10&cursor=<lastSeenId>
userRoutes.get("/feed/cursor", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const cursor = req.query.cursor || null;
		let limit = parseInt(req.query.limit) || 10;
		if (limit < 1 || limit > 50) limit = 10;

		const connections = await ConnectionRequest.find({
			$or: [{ sender: loggedInUser._id }, { receiver: loggedInUser._id }],
		}).select("sender receiver");

		const excludedIds = new Set([loggedInUser._id.toString()]);
		connections.forEach((conn) => {
			excludedIds.add(conn.sender.toString());
			excludedIds.add(conn.receiver.toString());
		});

		const filter = { _id: { $nin: [...excludedIds] } };
		if (cursor) {
			const mongoose = require("mongoose");
			if (!mongoose.Types.ObjectId.isValid(cursor)) {
				return res.status(400).json({ message: "Invalid cursor value" });
			}
			filter._id.$gt = new mongoose.Types.ObjectId(cursor);
		}

		const User = require("../model/user");
		const feedUsers = await User.find(filter)
			.select(USER_SAFE_FIELDS)
			.sort({ _id: 1 })
			.limit(limit);

		const nextCursor =
			feedUsers.length === limit ? feedUsers[feedUsers.length - 1]._id : null;

		res.status(200).json({
			message: "Your feed",
			data: feedUsers,
			nextCursor,
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching feed", error: err.message });
	}
});

module.exports = userRoutes;
