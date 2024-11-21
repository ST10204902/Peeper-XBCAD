import React from "react";
import { render } from "@testing-library/react-native";
import ComboBoxComponent from "../../components/ComboComponent";
import { useTheme } from "../../styles/ThemeContext";
import { Colors } from "../../styles/colors";

// Mock React Native's FlatList
jest.mock("react-native/Libraries/Lists/FlatList", () => "FlatList");

// Mock the ThemeContext
jest.mock("../../styles/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("ComboBoxComponent", () => {
  const mockOptions = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ];

  const mockOnValueChange = jest.fn();

  const mockTheme = {
    isDarkMode: false,
    theme: {
      componentBackground: "#FFFFFF",
      componentTextColour: "#000000",
      orgListOdd: "#F5F5F5",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
  });

  it("renders with placeholder when no value is selected", () => {
    const { getByText } = render(
      <ComboBoxComponent
        FGColor="#000000"
        placeHolderColor="#666666"
        placeholder="Select an option"
        options={mockOptions}
        onValueChange={mockOnValueChange}
      />,
    );

    expect(getByText("Select an option")).toBeTruthy();
  });

  it("displays selected option label", () => {
    const { getByText } = render(
      <ComboBoxComponent
        FGColor="#000000"
        placeHolderColor="#666666"
        options={mockOptions}
        value="1"
        onValueChange={mockOnValueChange}
      />,
    );

    expect(getByText("Option 1")).toBeTruthy();
  });

  it("applies custom colors correctly", () => {
    const customFGColor = "#FF0000";
    const customPlaceholderColor = "#999999";

    const { getByText } = render(
      <ComboBoxComponent
        FGColor={customFGColor}
        placeHolderColor={customPlaceholderColor}
        options={mockOptions}
        onValueChange={mockOnValueChange}
      />,
    );

    const placeholder = getByText("Select an option");
    const styles = placeholder.props.style;
    expect(styles[1]).toEqual(
      expect.objectContaining({
        color: customPlaceholderColor,
      }),
    );
  });

  it("handles dark mode theme", () => {
    const darkTheme = {
      isDarkMode: true,
      theme: {
        componentBackground: "#444444",
        componentTextColour: "#FFFFFF",
        orgListOdd: "#333333",
      },
    };

    (useTheme as jest.Mock).mockReturnValue(darkTheme);

    const { getByTestId } = render(
      <ComboBoxComponent
        FGColor={Colors.inputText}
        placeHolderColor={Colors.textGray}
        options={mockOptions}
        onValueChange={mockOnValueChange}
        testID="combo-box"
      />,
    );

    const comboBox = getByTestId("combo-box");
    expect(comboBox.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: darkTheme.theme.componentBackground,
      }),
    );
  });
});
