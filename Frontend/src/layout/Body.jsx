import React from "react";
import NavBar from "./NavBar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { parseError } from "../utils/errorHandler";
import ErrorAlert from "../components/ErrorAlert";

const Body = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const isChatRoute = location.pathname.startsWith("/chat/");
	const user = useSelector((state) => state.user);
	const [loading, setLoading] = React.useState(!user);
	const [error, setError] = React.useState(null);

	const fetchUser = React.useCallback(async () => {
		try {
			const result = await axios.get(BASE_URL + "/profile/view", {
				withCredentials: true,
			});
			dispatch(addUser(result.data.user));
			setError(null);
		} catch (err) {
			dispatch(removeUser());
			const parsed = parseError(err);
			if (parsed.retryable) {
				setError(parsed);
			}
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	React.useEffect(() => {
		if (!user) {
			// One-time auth check on mount; fetchUser's setState calls all run
			// after an await, not synchronously within this effect.
			// eslint-disable-next-line react-hooks/set-state-in-effect
			fetchUser();
		}
	}, [user, fetchUser]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<span className="loading loading-spinner loading-lg text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
				<div className="w-full max-w-md">
					<ErrorAlert error={error} onRetry={fetchUser} />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen">
			<NavBar />
			<main
				className={
					isChatRoute
						? "h-screen pt-16 flex flex-col overflow-hidden"
						: "flex-1 pt-16 flex flex-col"
				}
			>
				<Outlet />
			</main>
			{!isChatRoute && <Footer />}
		</div>
	);
};

export default Body;
