import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionsSlice";
import { parseError } from "../utils/errorHandler";
import { socket, getChatRoomId } from "../utils/socket";
import ErrorAlert from "../components/ErrorAlert";

const ChatWindow = ({ toUserId, chatUser, user, onBack }) => {
	const [messages, setMessages] = useState([]);
	const [historyLoading, setHistoryLoading] = useState(true);
	const [historyError, setHistoryError] = useState(null);
	const [draft, setDraft] = useState("");
	const messagesEndRef = useRef(null);
	const room = getChatRoomId(user._id, toUserId);

	const fetchHistory = useCallback(async () => {
		setHistoryLoading(true);
		try {
			const result = await axios.get(`${BASE_URL}/chat/${toUserId}`, {
				withCredentials: true,
			});
			setMessages(
				result.data.messages.map((m) => ({
					id: m._id,
					text: m.text,
					senderId: m.senderId,
				})),
			);
			setHistoryError(null);
		} catch (err) {
			setHistoryError(parseError(err));
		} finally {
			setHistoryLoading(false);
		}
	}, [toUserId]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchHistory();
	}, [fetchHistory]);

	useEffect(() => {
		socket.emit("joinRoom", room);

		const onMessage = (msg) => {
			if (msg.room !== room) return;
			setMessages((prev) => [
				...prev,
				{
					id: crypto.randomUUID(),
					text: msg.text,
					senderId: msg.senderId,
				},
			]);
		};

		socket.on("receiveMessage", onMessage);

		return () => {
			socket.off("receiveMessage", onMessage);
			socket.emit("leaveRoom", room);
		};
	}, [room]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = (e) => {
		e.preventDefault();
		const text = draft.trim();
		if (!text || !user) return;

		socket.emit("sendMessage", {
			room,
			text,
			senderId: user._id,
		});
		setDraft("");
	};

	return (
		<div className="flex flex-col flex-1 w-full max-w-2xl mx-auto min-h-0">
			<header className="flex items-center gap-3 px-4 py-3 border-b border-base-300 bg-base-100 shrink-0">
				<button
					type="button"
					aria-label="Back to connections"
					className="btn btn-ghost btn-circle btn-sm"
					onClick={onBack}
				>
					←
				</button>

				<div className="avatar">
					<div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
						<img src={chatUser.profilePictureURL} alt={chatUser.firstName} />
					</div>
				</div>

				<div className="min-w-0 flex-1">
					<h2 className="font-semibold truncate">
						{chatUser.firstName} {chatUser.lastName}
					</h2>
					<p className="text-xs text-base-content/50">Matched on Codemate</p>
				</div>
			</header>

			<div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
				{historyLoading ? (
					<div className="h-full flex items-center justify-center">
						<span className="loading loading-spinner loading-md text-primary" />
					</div>
				) : historyError ? (
					<ErrorAlert error={historyError} onRetry={fetchHistory} />
				) : messages.length === 0 ? (
					<div className="h-full flex items-center justify-center">
						<p className="text-base-content/50 text-sm text-center">
							No messages yet. Say hi to {chatUser.firstName}! 👋
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{messages.map((message) => {
							const isMe = String(message.senderId) === String(user?._id);

							return (
								<div
									key={message.id}
									className={`chat ${isMe ? "chat-end" : "chat-start"}`}
								>
									<div
										className={`chat-bubble ${
											isMe ? "chat-bubble-primary" : "chat-bubble-secondary"
										}`}
									>
										{message.text}
									</div>
								</div>
							);
						})}
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<form
				onSubmit={handleSend}
				className="flex items-center gap-2 px-4 py-3 border-t border-base-300 bg-base-100 shrink-0"
			>
				<input
					type="text"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					placeholder={`Message ${chatUser.firstName}...`}
					className="input input-bordered flex-1"
				/>
				<button
					type="submit"
					className="btn btn-primary"
					disabled={!draft.trim()}
				>
					Send
				</button>
			</form>
		</div>
	);
};

const Chat = () => {
	const { toUserId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const connections = useSelector((state) => state.connections);
	const [loading, setLoading] = useState(!connections);
	const [error, setError] = useState(null);

	const chatUser = connections?.find((match) => String(match._id) === toUserId);

	const fetchConnections = useCallback(async () => {
		try {
			const result = await axios.get(BASE_URL + "/user/matches", {
				withCredentials: true,
			});
			dispatch(addConnections(result.data.data));
			setError(null);
		} catch (err) {
			setError(parseError(err));
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		if (!connections) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			fetchConnections();
		}
	}, [connections, fetchConnections]);

	if (loading) {
		return (
			<div className="flex items-center justify-center flex-1">
				<span className="loading loading-spinner loading-lg text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center flex-1 px-4">
				<div className="w-full max-w-md">
					<ErrorAlert error={error} onRetry={fetchConnections} />
				</div>
			</div>
		);
	}

	if (!chatUser) {
		return (
			<div className="flex flex-col items-center justify-center flex-1 gap-4 px-4">
				<p className="text-base-content/60 text-lg text-center">
					This conversation isn't available.
				</p>
				<button
					type="button"
					className="btn btn-primary btn-sm"
					onClick={() => navigate("/connections")}
				>
					Back to Connections
				</button>
			</div>
		);
	}

	return (
		<ChatWindow
			key={toUserId}
			toUserId={toUserId}
			chatUser={chatUser}
			user={user}
			onBack={() => navigate("/connections")}
		/>
	);
};

export default Chat;
