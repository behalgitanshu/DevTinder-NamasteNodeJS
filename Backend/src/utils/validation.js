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

const ALLOWED_EDIT_FIELDS = [
	"firstName",
	"lastName",
	"age",
	"gender",
	"interests",
	"profilePictureURL",
	"aboutMe",
];

const validateProfileEditData = (data) => {
	const disallowedFields = Object.keys(data).filter(
		(key) => !ALLOWED_EDIT_FIELDS.includes(key),
	);
	if (disallowedFields.length > 0) {
		return {
			valid: false,
			message: `Fields not allowed to update: ${disallowedFields.join(", ")}`,
		};
	}
	if (data.firstName !== undefined && data.firstName.length < 2) {
		return {
			valid: false,
			message: "First name must be at least 2 characters long",
		};
	}
	if (data.age !== undefined && (data.age < 18 || data.age > 120)) {
		return { valid: false, message: "Age must be between 18 and 120" };
	}
	if (
		data.gender !== undefined &&
		!["Male", "Female", "Other"].includes(data.gender)
	) {
		return {
			valid: false,
			message: "Gender must be 'Male', 'Female', or 'Other'",
		};
	}
	return { valid: true };
};

module.exports = { validateSignupData, validateProfileEditData };
