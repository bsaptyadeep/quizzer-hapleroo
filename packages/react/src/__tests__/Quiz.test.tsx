import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Quiz } from "../Quiz";
import { mixedQuizFixture, singleChoiceQuizFixture } from "./fixtures";

describe("Quiz", () => {
  it("renders title and description", () => {
    render(<Quiz quiz={mixedQuizFixture} />);

    expect(screen.getByRole("heading", { name: "Mixed Quiz" })).toBeInTheDocument();
    expect(
      screen.getByText("A quiz with single and multiple choice questions."),
    ).toBeInTheDocument();
  });

  it("shows start screen and begins quiz on click", async () => {
    const user = userEvent.setup();
    render(<Quiz quiz={singleChoiceQuizFixture} />);

    await user.click(screen.getByRole("button", { name: "Start Quiz" }));

    expect(screen.getByRole("radio", { name: "let" })).toBeInTheDocument();
  });

  it("enables next after selecting a single-choice answer", async () => {
    const user = userEvent.setup();
    render(<Quiz quiz={singleChoiceQuizFixture} />);

    await user.click(screen.getByRole("button", { name: "Start Quiz" }));
    await user.click(screen.getByLabelText("let"));

    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });

  it("supports multiple-choice selection", async () => {
    const user = userEvent.setup();
    render(<Quiz quiz={mixedQuizFixture} />);

    await user.click(screen.getByRole("button", { name: "Start Quiz" }));
    await user.click(screen.getByLabelText("4"));
    await user.click(screen.getByRole("button", { name: "Next" }));

    await user.click(screen.getByLabelText("a"));
    await user.click(screen.getByLabelText("e"));

    expect(screen.getByLabelText("a")).toBeChecked();
    expect(screen.getByLabelText("e")).toBeChecked();
  });

  it("completes mixed quiz and shows result", async () => {
    const user = userEvent.setup();
    render(<Quiz quiz={mixedQuizFixture} />);

    await user.click(screen.getByRole("button", { name: "Start Quiz" }));
    await user.click(screen.getByLabelText("4"));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByLabelText("a"));
    await user.click(screen.getByLabelText("e"));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByLabelText("Mars"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText(/You scored 3 out of 3/i)).toBeInTheDocument();
  });

  it("disables next until current question is answered", async () => {
    const user = userEvent.setup();
    render(<Quiz quiz={mixedQuizFixture} />);

    await user.click(screen.getByRole("button", { name: "Start Quiz" }));

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("calls onComplete after submit", async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();

    render(<Quiz quiz={singleChoiceQuizFixture} onComplete={onComplete} />);

    await user.click(screen.getByRole("button", { name: "Start Quiz" }));
    await user.click(screen.getByLabelText("let"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 1,
        maxScore: 1,
        percentage: 100,
      }),
    );
  });

  it("restarts quiz from result screen", async () => {
    const user = userEvent.setup();
    render(<Quiz quiz={singleChoiceQuizFixture} />);

    await user.click(screen.getByRole("button", { name: "Start Quiz" }));
    await user.click(screen.getByLabelText("let"));
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await user.click(screen.getByRole("button", { name: "Restart Quiz" }));

    expect(screen.getByRole("button", { name: "Start Quiz" })).toBeInTheDocument();
  });

  it("invokes onEvent callback", async () => {
    const onEvent = vi.fn();

    render(<Quiz quiz={singleChoiceQuizFixture} onEvent={onEvent} autoStart />);

    await waitFor(() => {
      expect(onEvent).toHaveBeenCalled();
    });
  });
});
