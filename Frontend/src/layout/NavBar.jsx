import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";

const NavBar = () => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
		} catch (err) {
			console.error("Error logging out:", err);
		} finally {
			dispatch(removeUser());
			dispatch(clearFeed());
			navigate("/login");
		}
	};

	return (
		<div className="navbar bg-base-100 shadow-md fixed top-0 left-0 right-0 z-50">
			<div className="flex-1">
				<a className="btn btn-ghost text-xl font-bold text-primary">
					🤝 DevTinder
				</a>
			</div>
			{user && (
				<div className="flex items-center gap-3 mx-4">
					<div className="w-10 h-10 rounded-full overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2">
						<img
							alt={user.firstName}
							src={user.profilePictureURL}
							className="w-full h-full object-cover"
						/>
					</div>
					<Link to="/profile" className="btn btn-ghost btn-sm">
						Profile
					</Link>
					<button
						type="button"
						className="btn btn-ghost btn-sm text-error"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
};

export default NavBar;
