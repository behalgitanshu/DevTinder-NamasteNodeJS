const validator = require("validator");

const validateSignupData = (data) => {
	const { firstName, email, password } = data;
	if (!firstName || !email || !password) {
		return {
			valid: false,
			message: "First name, email, and password are required",
		};
	}
	if (
		typeof firstName !== "string" ||
		typeof email !== "string" ||
		typeof password !== "string"
	) {
		return {
			valid: false,
			message: "First name, email, and password must be strings",
		};
	}
	if (firstName.length < 2) {
		return {
			valid: false,
			message: "First name must be at least 2 characters long",
		};
	}
	if (!validator.isEmail(email)) {
		return {
			valid: false,
			message: "Invalid email format",
		};
	}
	if (password.length < 6) {
		return {
			valid: false,
			message: "Password must be at least 6 characters long",
		};
	}
	return { valid: true };
};

module.exports = { validateSignupData };
