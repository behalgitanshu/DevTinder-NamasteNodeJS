import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { parseError } from "../utils/errorHandler";
import ErrorAlert from "../components/ErrorAlert";
import SwipeCard from "../components/SwipeCard";
import UserCard from "../components/UserCard";

const Feed = () => {
	const dispatch = useDispatch();
	const feed = useSelector((state) => state.feed);
	const [loading, setLoading] = useState(!feed);
	const [error, setError] = useState(null);
	const [actionId, setActionId] = useState(null);

	const fetchFeed = useCallback(async () => {
		try {
			const result = await axios.get(BASE_URL + "/user/feed", {
				withCredentials: true,
			});
			dispatch(addFeed(result.data.data));
			setError(null);
		} catch (err) {
			setError(parseError(err));
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		if (!feed) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			fetchFeed();
		}
	}, [feed, fetchFeed]);

	const handleAction = async (status, userId) => {
		setActionId(userId);
		try {
			await axios.post(
				`${BASE_URL}/request/send/${status}/${userId}`,
				{},
				{ withCredentials: true },
			);
			dispatch(removeUserFromFeed(userId));
		} catch (err) {
			setError(parseError(err));
		} finally {
			setActionId(null);
		}
	};

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
					<ErrorAlert error={error} onRetry={fetchFeed} />
				</div>
			</div>
		);
	}

	const currentUser = feed?.[0];
	const nextUser = feed?.[1];

	if (!currentUser) {
		return (
			<div className="flex items-center justify-center flex-1">
				<p className="text-base-content/60 text-lg">
					No new users right now. Check back later!
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center flex-1 py-10 gap-6">
			<div className="relative w-full max-w-sm aspect-[3/4]">
				{nextUser && (
					<div className="absolute inset-0 scale-95 opacity-70 pointer-events-none">
						<UserCard user={nextUser} />
					</div>
				)}
				<SwipeCard
					className="absolute inset-0"
					onSwipeLeft={() => handleAction("ignore", currentUser._id)}
					onSwipeRight={() => handleAction("interested", currentUser._id)}
				>
					<UserCard user={currentUser} />
				</SwipeCard>
			</div>

			<div className="flex gap-4 w-full max-w-sm">
				<button
					type="button"
					className="btn btn-outline flex-1"
					disabled={actionId === currentUser._id}
					onClick={() => handleAction("ignore", currentUser._id)}
				>
					Ignore
				</button>
				<button
					type="button"
					className="btn btn-primary flex-1"
					disabled={actionId === currentUser._id}
					onClick={() => handleAction("interested", currentUser._id)}
				>
					Interested
				</button>
			</div>
		</div>
	);
};

export default Feed;
