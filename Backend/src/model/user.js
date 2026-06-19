const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			minlength: 2,
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
			trim: true,
			validate: {
				validator: function (v) {
					return validator.isEmail(v);
				},
				message: (props) =>
					`${props.value} is not a valid email! Please enter a valid email address.`,
			},
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			validate: {
				validator: function (v) {
					return validator.isStrongPassword(v, {
						minLength: 6,
						minLowercase: 1,
						minUppercase: 1,
						minNumbers: 1,
						minSymbols: 0,
					});
				},
				message: () =>
					`Password is not strong enough! It must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.`,
			},
		},
		age: {
			type: Number,
			min: 18,
			max: 120,
		},
		gender: {
			type: String,
			validate: {
				validator: function (v) {
					return ["Male", "Female", "Other"].includes(v);
				},
				message: (props) =>
					`${props.value} is not a valid gender! Must be 'Male', 'Female', or 'Other'.`,
			},
		},
		interests: {
			type: [String],
		},
		profilePictureURL: {
			type: String,
			validate: {
				validator: function (v) {
					return validator.isURL(v, { require_tld: false });
				},
				message: (props) =>
					`${props.value} is not a valid URL! Please enter a valid profile picture URL.`,
			},
			default:
				"https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png",
		},
		aboutMe: {
			type: String,
			default: "This is my profile. I am new here!",
		},
	},
	{
		timestamps: true,
		versionKey: "version",
	},
);

userSchema.methods.getJWT = async function () {
	const user = this;
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
	return token;
};

userSchema.methods.validatePassword = async function (password) {
	const user = this;
	return await bcrypt.compare(password, user.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
