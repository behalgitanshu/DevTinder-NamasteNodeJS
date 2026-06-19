import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

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
					<div className="dropdown dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle avatar"
						>
							<div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
								<img alt={user.firstName} src={user.profilePictureURL} />
							</div>
						</div>
						<ul
							tabIndex="-1"
							className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-200"
						>
							<li>
								<a className="justify-between">
									Profile
									<span className="badge badge-primary badge-sm">New</span>
								</a>
							</li>
							<li>
								<a>Settings</a>
							</li>
							<li className="mt-1">
								<a className="text-error" onClick={handleLogout}>
									Logout
								</a>
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default NavBar;
