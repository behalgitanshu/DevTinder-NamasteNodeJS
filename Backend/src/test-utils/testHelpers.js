const bcrypt = require("bcrypt");
const User = require("../model/user");

let counter = 0;

const createTestUser = async (overrides = {}) => {
	counter += 1;
	const password = await bcrypt.hash("Password1", 10);
	const user = await User.create({
		firstName: "Test",
		lastName: `User${counter}`,
		email: `test-user-${counter}@example.com`,
		password,
		...overrides,
	});
	const token = await user.getJWT();
	return { user, token };
};

module.exports = { createTestUser };
