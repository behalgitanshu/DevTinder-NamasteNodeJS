const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");

const userRoutes = express.Router();

const USER_SAFE_FIELDS =
	"firstName lastName age gender interests profilePictureURL aboutMe";

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

module.exports = userRoutes;
