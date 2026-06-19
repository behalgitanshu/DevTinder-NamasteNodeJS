import { describe, it, expect } from "vitest";
import userReducer, { addUser, removeUser } from "../userSlice";

describe("userSlice", () => {
	it("has a null initial state", () => {
		expect(userReducer(undefined, { type: "@@init" })).toBeNull();
	});

	it("addUser sets the state to the given user", () => {
		const user = { _id: "1", firstName: "Jane" };
		expect(userReducer(null, addUser(user))).toEqual(user);
	});

	it("removeUser resets the state to null", () => {
		const user = { _id: "1", firstName: "Jane" };
		expect(userReducer(user, removeUser())).toBeNull();
	});
});
