import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "./App";
import data from "./data";

describe("App Component", () => {
  test("renders input field and responds to changes", () => {
    render(<App />);
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "b" } });
    expect(input.value).toBe("b");
  });

  test("renders suggestions based on input value", () => {
    render(<App />);
    const input = screen.getByTestId("search-input");

    fireEvent.change(input, { target: { value: "a" } });

    const suggestionItems = screen.getAllByTestId(`suggestion-title-1`);
    expect(suggestionItems.length).toBeLessThanOrEqual(10); // Ensure max 10 suggestions
    expect(suggestionItems[0]).toBeInTheDocument();

    fireEvent.click(suggestionItems[0]);
    expect(input.value).toBe(data[0].title); // Check if input is updated
  });

  test("clears input and hides suggestions when clear button is clicked", () => {
    render(<App />);
    const input = screen.getByTestId("search-input");
    const clearButton = screen.getByTestId("clear-button");

    fireEvent.change(input, { target: { value: "a" } });
    expect(input.value).toBe("a");

    fireEvent.click(clearButton);
    expect(input.value).toBe("");
    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
  });

  test("shows loading indicator during search", async () => {
    render(<App />);
    const input = screen.getByTestId("search-input");

    fireEvent.change(input, { target: { value: "a" } });
    const firstSuggestion = screen.getByTestId(`suggestion-title-1`);
    fireEvent.click(firstSuggestion);

    const loadingIndicator = screen.getByTestId("loading-indicator");
    expect(loadingIndicator).toBeInTheDocument();

    await waitFor(
      () => {
        expect(loadingIndicator).not.toBeInTheDocument();
      },
      { timeout: 1100 }
    );
  });
});
