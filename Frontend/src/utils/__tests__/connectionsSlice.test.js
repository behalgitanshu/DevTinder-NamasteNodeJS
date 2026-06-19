import { describe, it, expect } from "vitest";
import connectionsReducer, {
	addConnections,
	clearConnections,
} from "../connectionsSlice";

describe("connectionsSlice", () => {
	it("has a null initial state", () => {
		expect(connectionsReducer(undefined, { type: "@@init" })).toBeNull();
	});

	it("addConnections sets the state to the given list", () => {
		const connections = [{ _id: "1" }, { _id: "2" }];
		expect(connectionsReducer(null, addConnections(connections))).toEqual(
			connections,
		);
	});

	it("clearConnections resets the state to null", () => {
		const connections = [{ _id: "1" }];
		expect(connectionsReducer(connections, clearConnections())).toBeNull();
	});
});
