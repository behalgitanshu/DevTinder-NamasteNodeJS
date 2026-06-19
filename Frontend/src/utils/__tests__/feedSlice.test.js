import { describe, it, expect } from "vitest";
import feedReducer, {
	addFeed,
	appendFeed,
	removeUserFromFeed,
	clearFeed,
} from "../feedSlice";

describe("feedSlice", () => {
	it("has a null initial state", () => {
		expect(feedReducer(undefined, { type: "@@init" })).toBeNull();
	});

	it("addFeed sets the state to the given list", () => {
		const users = [{ _id: "1" }, { _id: "2" }];
		expect(feedReducer(null, addFeed(users))).toEqual(users);
	});

	it("appendFeed adds to the existing list", () => {
		const users = [{ _id: "1" }];
		const more = [{ _id: "2" }];
		expect(feedReducer(users, appendFeed(more))).toEqual([
			{ _id: "1" },
			{ _id: "2" },
		]);
	});

	it("appendFeed sets the state when it was null", () => {
		const more = [{ _id: "1" }];
		expect(feedReducer(null, appendFeed(more))).toEqual(more);
	});

	it("removeUserFromFeed filters out the given user", () => {
		const users = [{ _id: "1" }, { _id: "2" }];
		const result = feedReducer(users, removeUserFromFeed("1"));
		expect(result).toEqual([{ _id: "2" }]);
	});

	it("removeUserFromFeed is a no-op when state is null", () => {
		expect(feedReducer(null, removeUserFromFeed("1"))).toBeNull();
	});

	it("clearFeed resets the state to null", () => {
		const users = [{ _id: "1" }];
		expect(feedReducer(users, clearFeed())).toBeNull();
	});
});
