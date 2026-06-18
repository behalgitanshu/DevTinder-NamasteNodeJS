import { useState } from "react";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// TODO: handle login
	};

	return (
		<div className="flex-1 bg-base-200 flex items-center justify-center py-10">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
						Welcome Back
					</h2>
					<p className="text-center text-base-content/60 mb-6">
						Sign in to your account
					</p>

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
							/>
						</label>

						<button type="submit" className="btn btn-primary w-full mt-2">
							Sign In
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
