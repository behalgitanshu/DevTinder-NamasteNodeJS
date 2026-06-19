import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const Fallback = ({ resetErrorBoundary }) => (
	<div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
		<div className="card w-full max-w-md bg-base-100 shadow-xl">
			<div className="card-body items-center text-center">
				<h2 className="card-title">Something went wrong</h2>
				<p className="text-base-content/60">
					An unexpected error occurred. Please reload the page.
				</p>
				<button
					type="button"
					onClick={resetErrorBoundary}
					className="btn btn-primary mt-2"
				>
					Reload
				</button>
			</div>
		</div>
	</div>
);

const ErrorBoundary = ({ children }) => (
	<ReactErrorBoundary
		FallbackComponent={Fallback}
		onError={(error, info) =>
			console.error("Uncaught render error:", error, info)
		}
		onReset={() => window.location.reload()}
	>
		{children}
	</ReactErrorBoundary>
);

export default ErrorBoundary;
