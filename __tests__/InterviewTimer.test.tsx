import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import InterviewTimer from "../app/interview/[interview_id]/start/_components/InterviewTimer";

describe("InterviewTimer Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders initially with 00:00:00 when not running", () => {
    render(<InterviewTimer isRunning={false} />);
    expect(screen.getByTestId("interview-timer")).toHaveTextContent("00:00:00");
  });

  it("increments timer seconds when isRunning is true", () => {
    render(<InterviewTimer isRunning={true} />);
    expect(screen.getByTestId("interview-timer")).toHaveTextContent("00:00:00");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId("interview-timer")).toHaveTextContent("00:00:05");
  });
});
