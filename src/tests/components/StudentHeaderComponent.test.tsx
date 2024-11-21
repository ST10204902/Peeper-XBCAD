import React from "react";
import { render } from "@testing-library/react-native";
import StudentHeaderComponent from "../../components/StudentHeaderComponent";
import { Student } from "../../databaseModels/databaseClasses/Student";
import { useTheme } from "../../styles/ThemeContext";
import MyMaths from "../../utils/MyMaths";
import { AvatarUtility } from "../../utils/AvatarUtility";

// Mock dependencies
jest.mock("../../styles/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

jest.mock("../../utils/MyMaths", () => ({
  calculateTotalLoggedHours: jest.fn(),
}));

jest.mock("../../utils/AvatarUtility", () => ({
  AvatarUtility: {
    getAvatarSource: jest.fn(),
  },
}));

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

describe("StudentHeaderComponent", () => {
  const mockStudent: Student = new Student({
    student_id: "test123",
    studentNumber: "ST12345678",
    email: "test@example.com",
    profilePhotoId: "avatar_1",
    activeOrgs: [],
    locationData: {},
    darkMode: false,
  });

  const mockTheme = {
    isDarkMode: false,
    theme: {
      fontRegular: "#000000",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
    (MyMaths.calculateTotalLoggedHours as jest.Mock).mockReturnValue(2.5);
    (AvatarUtility.getAvatarSource as jest.Mock).mockReturnValue("test-avatar-source");
  });

  it("renders student number correctly", () => {
    const { getByText } = render(<StudentHeaderComponent currentStudent={mockStudent} />);
    expect(getByText(mockStudent.studentNumber)).toBeTruthy();
  });

  it("displays correct progress text", () => {
    const { getByText } = render(<StudentHeaderComponent currentStudent={mockStudent} />);
    expect(getByText("2.5 out of 4 hours completed")).toBeTruthy();
  });

  it("handles maximum hours correctly", () => {
    (MyMaths.calculateTotalLoggedHours as jest.Mock).mockReturnValue(5);
    const { getByText } = render(<StudentHeaderComponent currentStudent={mockStudent} />);
    expect(getByText("4 out of 4 hours completed")).toBeTruthy();
  });

  it("uses default avatar when profilePhotoId is empty", () => {
    const studentWithoutAvatar = new Student({
      ...mockStudent,
      profilePhotoId: "",
    });

    render(<StudentHeaderComponent currentStudent={studentWithoutAvatar} />);
    expect(AvatarUtility.getAvatarSource).toHaveBeenCalledWith("avatar_1");
  });

  it("uses provided avatar when profilePhotoId exists", () => {
    const studentWithAvatar = new Student({
      ...mockStudent,
      profilePhotoId: "avatar_2",
    });

    render(<StudentHeaderComponent currentStudent={studentWithAvatar} />);
    expect(AvatarUtility.getAvatarSource).toHaveBeenCalledWith("avatar_2");
  });

  it("applies dark theme styles when in dark mode", () => {
    const darkThemeColor = "#f9f9f9";
    (useTheme as jest.Mock).mockReturnValue({
      isDarkMode: true,
      theme: {
        fontRegular: darkThemeColor,
      },
    });

    const { getByText } = render(<StudentHeaderComponent currentStudent={mockStudent} />);
    const studentNumber = getByText(mockStudent.studentNumber);

    const hasCorrectColor = studentNumber.props.style.some(
      (style: Record<string, unknown>) => style.color === darkThemeColor,
    );

    expect(hasCorrectColor).toBe(true);
  });

  it("calculates progress bar width correctly", () => {
    (MyMaths.calculateTotalLoggedHours as jest.Mock).mockReturnValue(2);
    const { getByTestId } = render(
      <StudentHeaderComponent currentStudent={mockStudent} testID="progress-bar" />,
    );
    const progressBar = getByTestId("progress-bar");
    expect(progressBar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: "50%", // 2/4 * 100
        }),
      ]),
    );
  });
});
