import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Quiz } from "../Quiz";
import { mixedQuizFixture, singleChoiceQuizFixture } from "./fixtures";

async function completeSingleChoiceQuiz(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: "Start Quiz" }));
  await user.click(screen.getByLabelText("let"));
  await user.click(screen.getByRole("button", { name: "Submit" }));
}

async function completeMixedQuiz(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: "Start Quiz" }));
  await user.click(screen.getByLabelText("4"));
  await user.click(screen.getByRole("button", { name: "Next" }));
  await user.click(screen.getByLabelText("a"));
  await user.click(screen.getByLabelText("e"));
  await user.click(screen.getByRole("button", { name: "Next" }));
  await user.click(screen.getByLabelText("Mars"));
  await user.click(screen.getByRole("button", { name: "Submit" }));
}

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

    await completeMixedQuiz(user);

    expect(screen.getByRole("heading", { name: "Perfect score!" })).toBeInTheDocument();
    expect(screen.getAllByText("100%").length).toBeGreaterThan(0);
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
    await user.click(screen.getByRole("button", { name: "Try Again" }));

    expect(screen.getByRole("button", { name: "Start Quiz" })).toBeInTheDocument();
  });

  it("invokes onEvent callback", async () => {
    const onEvent = vi.fn();

    render(<Quiz quiz={singleChoiceQuizFixture} onEvent={onEvent} autoStart />);

    await waitFor(() => {
      expect(onEvent).toHaveBeenCalled();
    });
  });

  it("autoStart renders first question immediately", async () => {
    render(<Quiz quiz={singleChoiceQuizFixture} autoStart />);

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Start Quiz" })).not.toBeInTheDocument();
    });

    expect(screen.getByRole("radio", { name: "let" })).toBeInTheDocument();
  });

  it("autoStart restart returns to first question", async () => {
    const user = userEvent.setup();
    render(<Quiz quiz={singleChoiceQuizFixture} autoStart />);

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "let" })).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("let"));
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await user.click(screen.getByRole("button", { name: "Try Again" }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Start Quiz" })).not.toBeInTheDocument();
    });

    expect(screen.getByRole("radio", { name: "let" })).toBeInTheDocument();
  });

  it("default finish page shows tier headline and score ring", async () => {
    const user = userEvent.setup();
    render(<Quiz quiz={singleChoiceQuizFixture} autoStart />);

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "let" })).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("let"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByRole("heading", { name: "Perfect score!" })).toBeInTheDocument();
    expect(screen.getAllByText("100%").length).toBeGreaterThan(0);
  });

  it("finishPage title override replaces tier headline", async () => {
    const user = userEvent.setup();
    render(
      <Quiz
        quiz={singleChoiceQuizFixture}
        autoStart
        finishPage={{ title: "Custom finish!" }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "let" })).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("let"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByRole("heading", { name: "Custom finish!" })).toBeInTheDocument();
  });

  it("finishPage showQuestionBreakdown lists questions", async () => {
    const user = userEvent.setup();
    render(
      <Quiz
        quiz={singleChoiceQuizFixture}
        autoStart
        finishPage={{ showQuestionBreakdown: true }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "let" })).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("let"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Question breakdown")).toBeInTheDocument();
    expect(
      screen.getByText("Which keyword declares a block-scoped variable?"),
    ).toBeInTheDocument();
  });

  it("finishPage minimal variant matches legacy layout", async () => {
    const user = userEvent.setup();
    render(
      <Quiz quiz={singleChoiceQuizFixture} finishPage={{ variant: "minimal" }} />,
    );

    await completeSingleChoiceQuiz(user);

    expect(screen.getByText(/You scored 1 out of 1/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restart Quiz" })).toBeInTheDocument();
  });

  it("renderFinishPage replaces built-in template", async () => {
    const user = userEvent.setup();
    render(
      <Quiz
        quiz={singleChoiceQuizFixture}
        autoStart
        renderFinishPage={({ result }) => (
          <div>Custom result: {result.percentage}%</div>
        )}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "let" })).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("let"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Custom result: 100%")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Perfect score!" })).not.toBeInTheDocument();
  });

  it("finishPage hideRestart and custom restartLabel work", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Quiz
        quiz={singleChoiceQuizFixture}
        autoStart
        finishPage={{ restartLabel: "Play again", hideRestart: true }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "let" })).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("let"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.queryByRole("button", { name: "Play again" })).not.toBeInTheDocument();

    rerender(
      <Quiz
        quiz={singleChoiceQuizFixture}
        autoStart
        finishPage={{ restartLabel: "Play again" }}
      />,
    );

    expect(screen.getByRole("button", { name: "Play again" })).toBeInTheDocument();
  });
});
