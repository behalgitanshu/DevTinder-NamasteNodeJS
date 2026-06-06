const express = require("express");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

// Send Connection Request API
router.post("/sendConnectionRequest", userAuth, async (req, res) => {
	console.log("Send connection request:", req.body);
	res.send("Connection request sent");
});

module.exports = router;
