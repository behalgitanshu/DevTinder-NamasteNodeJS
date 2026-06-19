import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionsSlice";
import { parseError } from "../utils/errorHandler";
import ErrorAlert from "../components/ErrorAlert";
import UserCard from "../components/UserCard";

const Connections = () => {
	const dispatch = useDispatch();
	const connections = useSelector((state) => state.connections);
	const [loading, setLoading] = useState(!connections);
	const [error, setError] = useState(null);

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

	if (!connections || connections.length === 0) {
		return (
			<div className="flex items-center justify-center flex-1">
				<p className="text-base-content/60 text-lg">
					No connections yet. Keep swiping on the feed!
				</p>
			</div>
		);
	}

	return (
		<div className="flex-1 py-10 px-4">
			<h1 className="text-2xl font-bold text-center mb-8">Your Connections</h1>
			<div className="flex flex-wrap justify-center gap-6">
				{connections.map((user) => (
					<UserCard key={user._id} user={user} />
				))}
			</div>
		</div>
	);
};

export default Connections;
