const ErrorAlert = ({ error, onRetry }) => {
	if (!error) return null;

	return (
		<div className="alert alert-error flex items-center justify-between gap-3">
			<span className="text-sm">{error.message}</span>
			{error.retryable && onRetry && (
				<button
					type="button"
					onClick={onRetry}
					className="btn btn-sm btn-ghost shrink-0"
				>
					Retry
				</button>
			)}
		</div>
	);
};

export default ErrorAlert;
