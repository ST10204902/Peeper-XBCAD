import React from "react";
import { render } from "@testing-library/react-native";
import LoginRegisterHeadingComponent from "../../components/LoginRegisterHeadingComponent";
import { Colors } from "../../styles/colors";

describe("LoginRegisterHeadingComponent", () => {
  it("renders with default props correctly", () => {
    const testText = "Welcome";
    const { getByText } = render(<LoginRegisterHeadingComponent text={testText} />);

    const heading = getByText(testText);
    expect(heading).toBeTruthy();
    const styles = heading.props.style;
    expect(styles[0]).toEqual({
      fontSize: 75,
      fontFamily: "Quittance",
      textAlign: "left",
      marginTop: 20,
      color: Colors.hyperlinkText,
    });
  });

  it("applies custom color when provided", () => {
    const testText = "Welcome";
    const customColor = "#FF0000";
    const { getByText } = render(
      <LoginRegisterHeadingComponent text={testText} color={customColor} />,
    );

    const heading = getByText(testText);
    const styles = heading.props.style;
    expect(styles[1]).toEqual(
      expect.objectContaining({
        color: customColor,
        fontSize: 75,
      }),
    );
  });

  it("applies custom font size when provided", () => {
    const testText = "Welcome";
    const customFontSize = 50;
    const { getByText } = render(
      <LoginRegisterHeadingComponent text={testText} fontSize={customFontSize} />,
    );

    const heading = getByText(testText);
    const styles = heading.props.style;
    expect(styles[1]).toEqual(
      expect.objectContaining({
        fontSize: customFontSize,
      }),
    );
  });

  it("handles long text correctly", () => {
    const longText = "This is a very long heading text that should still render correctly";
    const { getByText } = render(<LoginRegisterHeadingComponent text={longText} />);

    const heading = getByText(longText);
    expect(heading).toBeTruthy();
  });

  it("handles special characters", () => {
    const specialText = "Welcome! @ #$%^&*()";
    const { getByText } = render(<LoginRegisterHeadingComponent text={specialText} />);

    const heading = getByText(specialText);
    expect(heading).toBeTruthy();
  });

  it("maintains consistent styling with different text lengths", () => {
    const shortText = "Hi";
    const longText = "Welcome to our application!";

    const { rerender, getByText } = render(<LoginRegisterHeadingComponent text={shortText} />);
    const shortHeading = getByText(shortText);
    const shortStyles = shortHeading.props.style;

    rerender(<LoginRegisterHeadingComponent text={longText} />);
    const longHeading = getByText(longText);
    const longStyles = longHeading.props.style;

    // Compare base styles
    expect(shortStyles[0]).toEqual(longStyles[0]);
  });

  it("maintains consistent override styling when present", () => {
    const shortText = "Hi";
    const longText = "Welcome to our application!";
    const customColor = "#FF0000";

    const { rerender, getByText } = render(
      <LoginRegisterHeadingComponent text={shortText} color={customColor} />,
    );
    const shortHeading = getByText(shortText);
    const shortStyles = shortHeading.props.style;

    rerender(<LoginRegisterHeadingComponent text={longText} color={customColor} />);
    const longHeading = getByText(longText);
    const longStyles = longHeading.props.style;

    expect(shortStyles[1]).toEqual(longStyles[1]);
  });

  it("applies all style properties correctly with overrides", () => {
    const testText = "Welcome";
    const customColor = "#FF0000";
    const { getByText } = render(
      <LoginRegisterHeadingComponent text={testText} color={customColor} />,
    );

    const heading = getByText(testText);
    const styles = heading.props.style;

    expect(styles[0]).toEqual({
      fontSize: 75,
      fontFamily: "Quittance",
      textAlign: "left",
      marginTop: 20,
      color: Colors.hyperlinkText,
    });

    expect(styles[1]).toEqual({
      color: customColor,
      fontSize: 75,
    });
  });
});
