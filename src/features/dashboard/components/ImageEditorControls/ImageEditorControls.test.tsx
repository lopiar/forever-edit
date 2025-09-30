import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ImageEditorControls } from "./ImageEditorControls";

const mockSetSearchParams = vi.fn();
vi.mock("react-router-dom", async () => {
  return {
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  };
});

describe("ImageEditorControls", () => {
  const defaultProps = {
    urlWidth: 1200,
    urlHeight: 800,
    urlGrayscale: 0,
    urlBlur: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all controls with correct initial values", () => {
    render(<ImageEditorControls {...defaultProps} />);

    const widthInput = screen.getByDisplayValue("1200");
    const heightInput = screen.getByDisplayValue("800");
    // Use getAllByDisplayValue for multiple elements with same value (grayscale and blur)
    const zeroValueInputs = screen.getAllByDisplayValue("0");

    // Should have 2 inputs with value "0"
    expect(zeroValueInputs).toHaveLength(2);

    expect(widthInput).toBeTruthy();
    expect(heightInput).toBeTruthy();
    expect(zeroValueInputs[0]).toBeTruthy(); // grayscale
    expect(zeroValueInputs[1]).toBeTruthy(); // blur

    const rangeInputs = screen.getAllByRole("slider");
    expect(rangeInputs).toHaveLength(2);

    expect(screen.getByText("Reset All")).toBeTruthy();
  });

  it("should reset all values when reset button is clicked", () => {
    const customProps = {
      urlWidth: 1500,
      urlHeight: 1000,
      urlGrayscale: 50,
      urlBlur: 5,
    };

    render(<ImageEditorControls {...customProps} />);

    // Verify initial custom values are displayed
    expect(screen.getByDisplayValue("1500")).toBeTruthy();
    expect(screen.getByDisplayValue("1000")).toBeTruthy();
    expect(screen.getByDisplayValue("50")).toBeTruthy();
    expect(screen.getByDisplayValue("5")).toBeTruthy();
    expect(screen.getByText("50%")).toBeTruthy();
    expect(screen.getByText("5px")).toBeTruthy();

    // Click reset button
    const resetButton = screen.getByText("Reset All");
    fireEvent.click(resetButton);

    // Verify values are reset to defaults
    expect(screen.getByDisplayValue("1200")).toBeTruthy();
    expect(screen.getByDisplayValue("800")).toBeTruthy();

    const resetZeroValues = screen.getAllByDisplayValue("0");
    expect(resetZeroValues).toHaveLength(2); // grayscale and blur both reset to 0

    // Verify setSearchParams was called to clear URL parameters
    expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams());
  });
});
