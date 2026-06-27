import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const socket = io(BASE_URL, { withCredentials: true });

// Deterministic, order-independent room id for a pair of users — computing
// it the same way on both ends (regardless of who's "me" vs "them") means
// both participants land in the same Socket.IO room, and the room is unique
// to this pair so unrelated conversations never collide.
export const getChatRoomId = (userId, otherUserId) =>
	[String(userId), String(otherUserId)].sort().join("_");
