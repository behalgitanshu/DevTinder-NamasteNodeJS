import { describe, it, expect } from "vitest";
import { parseError } from "../errorHandler";

describe("parseError", () => {
	it("classifies a network error (no response) as retryable", () => {
		const result = parseError({});
		expect(result.type).toBe("network");
		expect(result.retryable).toBe(true);
	});

	it("classifies a 401 as a non-retryable auth error", () => {
		const result = parseError({ response: { status: 401, data: {} } });
		expect(result.type).toBe("auth");
		expect(result.retryable).toBe(false);
	});

	it("classifies a 403 as a non-retryable auth error", () => {
		const result = parseError({ response: { status: 403, data: {} } });
		expect(result.type).toBe("auth");
		expect(result.retryable).toBe(false);
	});

	it("classifies a 400 as a non-retryable validation error", () => {
		const result = parseError({ response: { status: 400, data: {} } });
		expect(result.type).toBe("validation");
		expect(result.retryable).toBe(false);
	});

	it("classifies a 500 as a retryable server error", () => {
		const result = parseError({ response: { status: 500, data: {} } });
		expect(result.type).toBe("server");
		expect(result.retryable).toBe(true);
	});

	it("classifies an unmapped status as a non-retryable unknown error", () => {
		const result = parseError({ response: { status: 418, data: {} } });
		expect(result.type).toBe("unknown");
		expect(result.retryable).toBe(false);
	});

	it("uses the server's string message when provided", () => {
		const result = parseError({
			response: { status: 400, data: "Email already in use" },
		});
		expect(result.message).toBe("Email already in use");
	});

	it("uses the server's message field when data is an object", () => {
		const result = parseError({
			response: { status: 400, data: { message: "Bad request" } },
		});
		expect(result.message).toBe("Bad request");
	});

	it("falls back to a default message when the server gives none", () => {
		const result = parseError({ response: { status: 400, data: {} } });
		expect(result.message).toMatch(/check your input/i);
	});
});
