import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorAlert from "../ErrorAlert";

describe("ErrorAlert", () => {
	it("renders nothing when there is no error", () => {
		const { container } = render(<ErrorAlert error={null} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders the error message", () => {
		render(
			<ErrorAlert error={{ message: "Something broke", retryable: false }} />,
		);
		expect(screen.getByText("Something broke")).toBeInTheDocument();
	});

	it("does not show a Retry button when the error is not retryable", () => {
		render(
			<ErrorAlert
				error={{ message: "Bad input", retryable: false }}
				onRetry={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Retry")).not.toBeInTheDocument();
	});

	it("does not show a Retry button when no onRetry handler is given", () => {
		render(<ErrorAlert error={{ message: "Network down", retryable: true }} />);
		expect(screen.queryByText("Retry")).not.toBeInTheDocument();
	});

	it("shows a Retry button when the error is retryable and a handler is given", () => {
		render(
			<ErrorAlert
				error={{ message: "Network down", retryable: true }}
				onRetry={vi.fn()}
			/>,
		);
		expect(screen.getByText("Retry")).toBeInTheDocument();
	});

	it("calls onRetry when the Retry button is clicked", () => {
		const onRetry = vi.fn();
		render(
			<ErrorAlert
				error={{ message: "Network down", retryable: true }}
				onRetry={onRetry}
			/>,
		);
		fireEvent.click(screen.getByText("Retry"));
		expect(onRetry).toHaveBeenCalledTimes(1);
	});
});
