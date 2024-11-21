import React from "react";
import { render } from "@testing-library/react-native";
import { PolicySectionComponent } from "../../components/PolicySectionComponent";
import { useTheme } from "../../styles/ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";

// Mock the ThemeContext
jest.mock("../../styles/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("PolicySectionComponent", () => {
  const mockTheme = {
    isDarkMode: false,
    theme: lightTheme,
  };

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
  });

  it("renders heading and content correctly", () => {
    const testHeading = "Test Heading";
    const testContent = "Test Content";

    const { getByText } = render(
      <PolicySectionComponent heading={testHeading} content={testContent} />,
    );

    expect(getByText(testHeading)).toBeTruthy();
    expect(getByText(testContent)).toBeTruthy();
  });

  it("applies correct styles in light mode", () => {
    const { getByTestId } = render(
      <PolicySectionComponent
        heading="Test Heading"
        content="Test Content"
        testID="policy-section"
      />,
    );

    const container = getByTestId("policy-section");
    const styles = container.props.style;

    // Check base styles
    expect(styles[0]).toEqual(
      expect.objectContaining({
        borderRadius: 20,
        marginBottom: 16,
        padding: 20,
      }),
    );

    // Check theme-specific styles
    expect(styles[1]).toEqual(
      expect.objectContaining({
        backgroundColor: lightTheme.sectionBackground,
      }),
    );
  });

  it("applies correct styles in dark mode", () => {
    const darkModeTheme = {
      isDarkMode: true,
      theme: darkTheme,
    };

    (useTheme as jest.Mock).mockReturnValue(darkModeTheme);

    const { getByTestId } = render(
      <PolicySectionComponent
        heading="Test Heading"
        content="Test Content"
        testID="policy-section"
      />,
    );

    const container = getByTestId("policy-section");
    const styles = container.props.style;

    // Check base styles
    expect(styles[0]).toEqual(
      expect.objectContaining({
        borderRadius: 20,
        marginBottom: 16,
        padding: 20,
      }),
    );

    // Check theme-specific styles
    expect(styles[1]).toEqual(
      expect.objectContaining({
        backgroundColor: darkTheme.sectionBackground,
      }),
    );
  });

  it("handles long content text", () => {
    const longContent = "a".repeat(500);
    const { getByText } = render(
      <PolicySectionComponent heading="Test Heading" content={longContent} />,
    );

    expect(getByText(longContent)).toBeTruthy();
  });

  it("handles special characters in content", () => {
    const specialContent = "Special characters: !@#$%^&*()_+";
    const { getByText } = render(
      <PolicySectionComponent heading="Test Heading" content={specialContent} />,
    );

    expect(getByText(specialContent)).toBeTruthy();
  });
});
