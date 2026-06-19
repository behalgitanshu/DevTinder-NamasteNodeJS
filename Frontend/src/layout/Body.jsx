import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";

const Body = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [loading, setLoading] = React.useState(!user);

	const fetchUser = React.useCallback(async () => {
		try {
			const result = await axios.get(BASE_URL + "/profile/view", {
				withCredentials: true,
			});
			dispatch(addUser(result.data.user));
		} catch {
			dispatch(removeUser());
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	React.useEffect(() => {
		if (!user) {
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

	return (
		<div className="flex flex-col min-h-screen">
			<NavBar />
			<main className="flex-1 pt-16 flex flex-col">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default Body;
