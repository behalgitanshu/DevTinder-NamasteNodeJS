const {
	validateSignupData,
	validateProfileEditData,
} = require("../utils/validation");

describe("validateSignupData", () => {
	it("accepts valid signup data", () => {
		const result = validateSignupData({
			firstName: "Jane",
			email: "jane@example.com",
			password: "secret1",
		});
		expect(result.valid).toBe(true);
	});

	it("rejects missing fields", () => {
		const result = validateSignupData({ firstName: "Jane" });
		expect(result.valid).toBe(false);
		expect(result.message).toMatch(/required/i);
	});

	it("rejects a first name shorter than 2 characters", () => {
		const result = validateSignupData({
			firstName: "J",
			email: "jane@example.com",
			password: "secret1",
		});
		expect(result.valid).toBe(false);
		expect(result.message).toMatch(/at least 2 characters/i);
	});

	it("rejects an invalid email format", () => {
		const result = validateSignupData({
			firstName: "Jane",
			email: "not-an-email",
			password: "secret1",
		});
		expect(result.valid).toBe(false);
		expect(result.message).toMatch(/invalid email/i);
	});

	it("rejects a password shorter than 6 characters", () => {
		const result = validateSignupData({
			firstName: "Jane",
			email: "jane@example.com",
			password: "12345",
		});
		expect(result.valid).toBe(false);
		expect(result.message).toMatch(/at least 6 characters/i);
	});

	it("rejects non-string fields", () => {
		const result = validateSignupData({
			firstName: "Jane",
			email: "jane@example.com",
			password: 123456,
		});
		expect(result.valid).toBe(false);
		expect(result.message).toMatch(/must be strings/i);
	});
});

describe("validateProfileEditData", () => {
	it("accepts an empty edit (no fields changed)", () => {
		expect(validateProfileEditData({}).valid).toBe(true);
	});

	it("accepts all allowed fields", () => {
		const result = validateProfileEditData({
			firstName: "Jane",
			lastName: "Doe",
			age: 25,
			gender: "Female",
			interests: ["Hiking"],
			profilePictureURL: "https://example.com/photo.jpg",
			aboutMe: "Hello",
		});
		expect(result.valid).toBe(true);
	});

	it("rejects fields outside the allow-list", () => {
		const result = validateProfileEditData({ email: "new@example.com" });
		expect(result.valid).toBe(false);
		expect(result.message).toMatch(/not allowed to update/i);
	});

	it("rejects a first name shorter than 2 characters", () => {
		const result = validateProfileEditData({ firstName: "J" });
		expect(result.valid).toBe(false);
		expect(result.message).toMatch(/at least 2 characters/i);
	});

	it("rejects age outside 18-120", () => {
		expect(validateProfileEditData({ age: 17 }).valid).toBe(false);
		expect(validateProfileEditData({ age: 121 }).valid).toBe(false);
		expect(validateProfileEditData({ age: 18 }).valid).toBe(true);
		expect(validateProfileEditData({ age: 120 }).valid).toBe(true);
	});

	it("rejects an invalid gender value", () => {
		const result = validateProfileEditData({ gender: "Robot" });
		expect(result.valid).toBe(false);
		expect(result.message).toMatch(/Male.*Female.*Other/i);
	});
});
