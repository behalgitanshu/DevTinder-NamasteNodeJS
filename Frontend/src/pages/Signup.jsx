import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { parseError } from "../utils/errorHandler";
import ErrorAlert from "../components/ErrorAlert";

const Signup = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const performSignup = async () => {
		setError(null);

		if (password !== confirmPassword) {
			setError({
				type: "validation",
				message: "Passwords do not match.",
				retryable: false,
			});
			return;
		}

		try {
			await axios.post(
				BASE_URL + "/signup",
				{ firstName, lastName, email, password },
				{ withCredentials: true },
			);
			navigate("/login", { state: { signupSuccess: true } });
		} catch (err) {
			setError(parseError(err));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		performSignup();
	};

	return (
		<div className="flex-1 bg-base-200 flex items-center justify-center py-10">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
						Create Account
					</h2>
					<p className="text-center text-base-content/60 mb-6">
						Join DevTinder and find your match
					</p>

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">First Name</span>
							</div>
							<input
								type="text"
								placeholder="Jane"
								className="input input-bordered w-full"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
								minLength={2}
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">Last Name</span>
							</div>
							<input
								type="text"
								placeholder="Doe"
								className="input input-bordered w-full"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">Email</span>
							</div>
							<input
								type="email"
								placeholder="you@example.com"
								className="input input-bordered w-full"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">Password</span>
							</div>
							<input
								type="password"
								placeholder="••••••••"
								className="input input-bordered w-full"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={6}
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">Confirm Password</span>
							</div>
							<input
								type="password"
								placeholder="••••••••"
								className="input input-bordered w-full"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								minLength={6}
							/>
						</label>

						<ErrorAlert error={error} onRetry={performSignup} />

						<button type="submit" className="btn btn-primary w-full mt-2">
							Sign Up
						</button>
					</form>

					<p className="text-center text-sm mt-4">
						Already have an account?{" "}
						<Link to="/login" className="link link-primary font-medium">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
