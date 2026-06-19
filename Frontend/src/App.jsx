import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import Body from "./layout/Body";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Connections from "./pages/Connections";
import appStore from "./utils/appStore";
import ErrorBoundary from "./components/ErrorBoundary";

const RequireAuth = ({ children }) => {
	const user = useSelector((state) => state.user);
	return user ? children : <Navigate to="/login" replace />;
};

const RedirectIfAuth = ({ children }) => {
	const user = useSelector((state) => state.user);
	return user ? <Navigate to="/feed" replace /> : children;
};

function App() {
	return (
		<ErrorBoundary>
			<Provider store={appStore}>
				<BrowserRouter basename="/">
					<Routes>
						<Route path="/" element={<Body />}>
							<Route
								index
								element={
									<RequireAuth>
										<Navigate to="/feed" replace />
									</RequireAuth>
								}
							/>
							<Route
								path="/login"
								element={
									<RedirectIfAuth>
										<Login />
									</RedirectIfAuth>
								}
							/>
							<Route
								path="/signup"
								element={
									<RedirectIfAuth>
										<Signup />
									</RedirectIfAuth>
								}
							/>
							<Route
								path="/feed"
								element={
									<RequireAuth>
										<Feed />
									</RequireAuth>
								}
							/>
							<Route
								path="/profile"
								element={
									<RequireAuth>
										<Profile />
									</RequireAuth>
								}
							/>
							<Route
								path="/connections"
								element={
									<RequireAuth>
										<Connections />
									</RequireAuth>
								}
							/>
							<Route path="*" element={<div>Page Not Found</div>} />
						</Route>
					</Routes>
				</BrowserRouter>
			</Provider>
		</ErrorBoundary>
	);
}

export default App;
