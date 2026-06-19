import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./layout/Body";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import Feed from "./pages/Feed";

function App() {
	return (
		<Provider store={appStore}>
			<BrowserRouter basename="/">
				<Routes>
					<Route path="/" element={<Body />}>
						<Route path="/login" element={<Login />} />
						<Route path="/feed" element={<Feed />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="*" element={<div>Page Not Found</div>} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
