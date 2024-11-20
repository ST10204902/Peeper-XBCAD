import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ConfirmationInputComponent from "../../components/ConfirmationInputComponent";
import { Colors } from "../../styles/colors";

describe("ConfirmationInputComponent", () => {
  const mockOnEmailChange = jest.fn();

  beforeEach(() => {
    mockOnEmailChange.mockClear();
  });

  it("renders with required props correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <ConfirmationInputComponent
        label="Test Label"
        FGColor={Colors.inputText}
        onEmailChange={mockOnEmailChange}
      />,
    );

    expect(getByText("Test Label")).toBeTruthy();
    expect(getByPlaceholderText("Input 6-digit code")).toBeTruthy();
  });

  it("handles text input changes", () => {
    const { getByPlaceholderText } = render(
      <ConfirmationInputComponent
        label="Test Label"
        FGColor={Colors.inputText}
        onEmailChange={mockOnEmailChange}
      />,
    );

    const input = getByPlaceholderText("Input 6-digit code");
    fireEvent.changeText(input, "123456");

    expect(mockOnEmailChange).toHaveBeenCalledWith("123456");
  });

  it("enforces maxLength of 6 digits", () => {
    const { getByPlaceholderText } = render(
      <ConfirmationInputComponent
        label="Test Label"
        FGColor={Colors.inputText}
        onEmailChange={mockOnEmailChange}
      />,
    );

    const input = getByPlaceholderText("Input 6-digit code");
    expect(input.props.maxLength).toBe(6);
  });

  it("uses numeric keyboard", () => {
    const { getByPlaceholderText } = render(
      <ConfirmationInputComponent
        label="Test Label"
        FGColor={Colors.inputText}
        onEmailChange={mockOnEmailChange}
      />,
    );

    const input = getByPlaceholderText("Input 6-digit code");
    expect(input.props.keyboardType).toBe("numeric");
  });

  it("applies custom foreground color", () => {
    const customColor = "#FF0000";
    const { getByPlaceholderText, getByText } = render(
      <ConfirmationInputComponent
        label="Test Label"
        FGColor={customColor}
        onEmailChange={mockOnEmailChange}
      />,
    );

    const input = getByPlaceholderText("Input 6-digit code");
    const label = getByText("Test Label");

    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: customColor,
        }),
      ]),
    );
    expect(input.props.placeholderTextColor).toBe(customColor);
    expect(label.props.style).toEqual(
      expect.objectContaining({
        color: Colors.inputText,
      }),
    );
  });

  it("displays initial value when provided", () => {
    const initialValue = "123456";
    const { getByDisplayValue } = render(
      <ConfirmationInputComponent
        label="Test Label"
        FGColor={Colors.inputText}
        onEmailChange={mockOnEmailChange}
        value={initialValue}
      />,
    );

    expect(getByDisplayValue(initialValue)).toBeTruthy();
  });

  it("maintains styles when value changes", () => {
    const { getByPlaceholderText } = render(
      <ConfirmationInputComponent
        label="Test Label"
        FGColor={Colors.inputText}
        onEmailChange={mockOnEmailChange}
      />,
    );

    const input = getByPlaceholderText("Input 6-digit code");
    fireEvent.changeText(input, "123456");

    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          height: 40,
          paddingHorizontal: 10,
          fontSize: 16,
          fontFamily: "Rany-Medium",
        }),
      ]),
    );
  });
});
