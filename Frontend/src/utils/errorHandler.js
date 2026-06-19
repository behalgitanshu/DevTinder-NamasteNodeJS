export const parseError = (err) => {
	if (!err?.response) {
		return {
			type: "network",
			message: "Can't reach the server. Check your connection and try again.",
			retryable: true,
		};
	}

	const { status, data } = err.response;
	const serverMessage = typeof data === "string" ? data : data?.message;

	if (status === 401 || status === 403) {
		return {
			type: "auth",
			message: serverMessage || "You're not authorized. Please log in again.",
			retryable: false,
		};
	}

	if (status === 400 || status === 422) {
		return {
			type: "validation",
			message: serverMessage || "Please check your input and try again.",
			retryable: false,
		};
	}

	if (status >= 500) {
		return {
			type: "server",
			message:
				serverMessage || "Something went wrong on our end. Please try again.",
			retryable: true,
		};
	}

	return {
		type: "unknown",
		message: serverMessage || "Something went wrong. Please try again.",
		retryable: false,
	};
};
