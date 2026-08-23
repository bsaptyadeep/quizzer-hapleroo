import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useQuizEngine } from "../hooks/useQuizEngine";
import { mixedQuizFixture, singleChoiceQuizFixture } from "./fixtures";

function TestHarness({
  quiz,
  autoStart,
  onComplete,
  onEvent,
}: {
  quiz: typeof mixedQuizFixture;
  autoStart?: boolean;
  onComplete?: () => void;
  onEvent?: (event: import("hapleroo-quizzard-core").QuizEvent) => void;
}) {
  const { state, actions } = useQuizEngine({
    quiz,
    autoStart,
    onComplete,
    onEvent,
  });

  const firstQuestionId = quiz.questions[0]?.id;

  return (
    <div>
      <span data-testid="status">{state.status}</span>
      <button type="button" onClick={actions.start}>
        Start
      </button>
      {firstQuestionId ? (
        <button
          type="button"
          onClick={() =>
            actions.answer(firstQuestionId, {
              type: "single-choice",
              selectedOptionId: "b",
            })
          }
        >
          Answer
        </button>
      ) : null}
      <button type="button" onClick={() => actions.submit()}>
        Force Submit
      </button>
      <button type="button" onClick={actions.restart}>
        Restart
      </button>
    </div>
  );
}

describe("useQuizEngine", () => {
  it("returns initial not_started state", () => {
    render(<TestHarness quiz={mixedQuizFixture} />);

    expect(screen.getByTestId("status")).toHaveTextContent("not_started");
  });

  it("autoStart transitions to in_progress", async () => {
    render(<TestHarness quiz={mixedQuizFixture} autoStart />);

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("in_progress");
    });
  });

  it("calls onEvent when quiz starts", async () => {
    const onEvent = vi.fn();
    const user = userEvent.setup();

    render(<TestHarness quiz={mixedQuizFixture} onEvent={onEvent} />);
    await user.click(screen.getByRole("button", { name: "Start" }));

    expect(onEvent).toHaveBeenCalled();
  });

  it("recreates engine when quiz id changes", async () => {
    const { rerender } = render(<TestHarness quiz={mixedQuizFixture} autoStart />);

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("in_progress");
    });

    rerender(<TestHarness quiz={singleChoiceQuizFixture} autoStart />);

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("in_progress");
    });
  });

  it("autoStart restarts back to in_progress", async () => {
    const user = userEvent.setup();
    render(<TestHarness quiz={singleChoiceQuizFixture} autoStart />);

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("in_progress");
    });

    await user.click(screen.getByRole("button", { name: "Answer" }));
    await user.click(screen.getByRole("button", { name: "Force Submit" }));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("completed");
    });

    await user.click(screen.getByRole("button", { name: "Restart" }));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("in_progress");
    });
  });
});
