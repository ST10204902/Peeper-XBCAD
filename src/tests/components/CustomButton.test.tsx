import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomButton from "../../components/CustomButton";
import { Colors } from "../../styles/colors";

describe("CustomButton", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it("renders with default props correctly", () => {
    const { getByText } = render(<CustomButton title="Test Button" onPress={mockOnPress} />);

    const button = getByText("Test Button");
    expect(button).toBeTruthy();
    expect(button.props.style[0]).toEqual(
      expect.objectContaining({
        color: Colors.registerPrimary,
        fontFamily: "Rany-Medium",
        fontSize: 25,
        textAlign: "center",
        textAlignVertical: "center",
      }),
    );
  });

  it("handles press events", () => {
    const { getByText } = render(<CustomButton title="Test Button" onPress={mockOnPress} />);

    fireEvent.press(getByText("Test Button"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("applies custom styles correctly", () => {
    const { getByText } = render(
      <CustomButton
        title="Styled Button"
        onPress={mockOnPress}
        textColor="red"
        buttonColor="blue"
        fontFamily="Quittance"
        textSize={16}
      />,
    );

    const button = getByText("Styled Button");
    expect(button.props.style[0]).toEqual(
      expect.objectContaining({
        color: "red",
        fontFamily: "Quittance",
        fontSize: 16,
        textAlign: "center",
        textAlignVertical: "center",
      }),
    );
  });

  it("handles disabled state", () => {
    const { getByText } = render(
      <CustomButton title="Disabled Button" onPress={mockOnPress} disabled={true} />,
    );

    fireEvent.press(getByText("Disabled Button"));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("renders label when provided", () => {
    const { getByText } = render(
      <CustomButton title="Button" onPress={mockOnPress} label="Test Label" />,
    );

    expect(getByText("Test Label")).toBeTruthy();
  });

  it("applies flex styling when addFlex is true", () => {
    const { getByTestId } = render(
      <CustomButton
        title="Flex Button"
        onPress={mockOnPress}
        addFlex={true}
        testID="flex-container"
      />,
    );

    const flexContainer = getByTestId("flex-container");
    expect(flexContainer.props.style).toEqual({
      flexDirection: "row",
      flex: 1,
    });
  });
});
