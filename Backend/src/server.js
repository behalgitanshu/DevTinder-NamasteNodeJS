require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");
const Chat = require("./model/chat");
const socket = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const initializeSocket = () => {
	const io = socket(server, {
		cors: {
			origin: process.env.CORS_ORIGIN || "http://localhost:5173",
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		console.log("A user connected");

		// handle join room
		socket.on("joinRoom", (roomId) => {
			socket.join(roomId);
			console.log(`User joined chat: ${roomId}`);
		});

		// handle leave room
		socket.on("leaveRoom", (room) => {
			socket.leave(room);
			console.log(`User left chat: ${room}`);
		});

		// handle send message
		socket.on("sendMessage", async (message) => {
			try {
				const { room, text, senderId } = message;
				if (!room || !text || !senderId) return;

				// roomId is the participant pair, sorted and joined with "_"
				// (see Chat.getRoomId / Frontend's getChatRoomId) — split it back
				// out to get the participants for a chat we haven't seen before.
				const participants = room.split("_");
				if (participants.length !== 2) return;

				let chat = await Chat.findOne({ roomId: room });
				if (!chat) {
					chat = new Chat({ participants, roomId: room });
				}

				chat.messages.push({ senderId, text });
				await chat.save();

				io.to(room).emit("receiveMessage", message);
			} catch (err) {
				console.error("Error saving message:", err);
			}
		});
	});

	return io;
};

initializeSocket();

connectDB()
	.then(() => {
		console.log("Connected to MongoDB");
		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err);
	});
