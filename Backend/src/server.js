require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");
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
		socket.on("sendMessage", (message) => {
			io.to(message.room).emit("receiveMessage", message);
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
