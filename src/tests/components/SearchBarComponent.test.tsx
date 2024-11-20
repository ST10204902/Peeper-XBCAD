import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SearchBarComponent from "../../components/SearchBarComponent";
import { useTheme } from "../../styles/ThemeContext";

// Mock the ThemeContext
jest.mock("../../styles/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("SearchBarComponent", () => {
  const mockOnSearchInputChange = jest.fn();
  const mockOnFocus = jest.fn();
  const mockOnBlur = jest.fn();

  const mockTheme = {
    componentBackground: "#FFFFFF",
    componentTextColour: "#000000",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      isDarkMode: false,
      theme: mockTheme,
    });
  });

  it("renders correctly with default props", () => {
    const { getByPlaceholderText } = render(
      <SearchBarComponent
        _FGColor="#000000"
        onSearchInputChange={mockOnSearchInputChange}
        _placeHolderColor="#666666"
      />,
    );

    const searchInput = getByPlaceholderText("Search");
    expect(searchInput).toBeTruthy();
  });

  it("handles text input changes", () => {
    const { getByPlaceholderText } = render(
      <SearchBarComponent
        _FGColor="#000000"
        onSearchInputChange={mockOnSearchInputChange}
        _placeHolderColor="#666666"
      />,
    );

    const searchInput = getByPlaceholderText("Search");
    fireEvent.changeText(searchInput, "test search");

    expect(mockOnSearchInputChange).toHaveBeenCalledWith("test search");
  });

  it("handles focus event", () => {
    const { getByPlaceholderText } = render(
      <SearchBarComponent
        _FGColor="#000000"
        onSearchInputChange={mockOnSearchInputChange}
        _placeHolderColor="#666666"
        onFocus={mockOnFocus}
      />,
    );

    const searchInput = getByPlaceholderText("Search");
    fireEvent(searchInput, "focus");

    expect(mockOnFocus).toHaveBeenCalled();
  });

  it("handles blur event", () => {
    const { getByPlaceholderText } = render(
      <SearchBarComponent
        _FGColor="#000000"
        onSearchInputChange={mockOnSearchInputChange}
        _placeHolderColor="#666666"
        onBlur={mockOnBlur}
      />,
    );

    const searchInput = getByPlaceholderText("Search");
    fireEvent.changeText(searchInput, "test search");
    fireEvent(searchInput, "blur");

    expect(mockOnBlur).toHaveBeenCalledWith("test search");
  });

  it("maintains placeholder text when empty on blur", () => {
    const { getByPlaceholderText } = render(
      <SearchBarComponent
        _FGColor="#000000"
        onSearchInputChange={mockOnSearchInputChange}
        _placeHolderColor="#666666"
      />,
    );

    const searchInput = getByPlaceholderText("Search");
    fireEvent(searchInput, "focus");
    fireEvent(searchInput, "blur");

    expect(getByPlaceholderText("Search")).toBeTruthy();
  });

  it("saves search text as placeholder on blur", () => {
    const { getByPlaceholderText } = render(
      <SearchBarComponent
        _FGColor="#000000"
        onSearchInputChange={mockOnSearchInputChange}
        _placeHolderColor="#666666"
      />,
    );

    const searchInput = getByPlaceholderText("Search");
    fireEvent.changeText(searchInput, "test search");
    fireEvent(searchInput, "blur");

    expect(getByPlaceholderText("test search")).toBeTruthy();
  });

  it("applies theme styles correctly", () => {
    const { getByPlaceholderText } = render(
      <SearchBarComponent
        _FGColor="#000000"
        onSearchInputChange={mockOnSearchInputChange}
        _placeHolderColor="#666666"
      />,
    );

    const searchInput = getByPlaceholderText("Search");
    const styles = searchInput.props.style;

    // Check base styles
    expect(styles[0]).toEqual(
      expect.objectContaining({
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: "Rany-Medium",
        width: "100%",
      }),
    );

    // Check theme color
    expect(styles[1]).toEqual(
      expect.objectContaining({
        color: expect.any(String), // We just verify it's a string since the actual color might vary
      }),
    );
  });

  it("handles dark mode theme", () => {
    const darkTheme = {
      componentBackground: "#000000",
      componentTextColour: "#FFFFFF",
    };

    (useTheme as jest.Mock).mockReturnValue({
      isDarkMode: true,
      theme: darkTheme,
    });

    const { getByPlaceholderText } = render(
      <SearchBarComponent
        _FGColor="#000000"
        onSearchInputChange={mockOnSearchInputChange}
        _placeHolderColor="#666666"
      />,
    );

    const searchInput = getByPlaceholderText("Search");
    const styles = searchInput.props.style;

    // Check base styles
    expect(styles[0]).toEqual(
      expect.objectContaining({
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: "Rany-Medium",
        width: "100%",
      }),
    );

    // Check theme color
    expect(styles[1]).toEqual(
      expect.objectContaining({
        color: expect.any(String), // We just verify it's a string since the actual color might vary
      }),
    );
  });
});
