import React from "react";
import { render } from "@testing-library/react-native";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import { useTheme } from "../../styles/ThemeContext";
import { Organisation } from "../../databaseModels/databaseClasses/Organisation";
import { OrgAddress } from "../../databaseModels/databaseClasses/OrgAddress";
import CustomButton from "../../components/CustomButton";
import { lightTheme } from "../../styles/themes";

// Mock the ThemeContext
jest.mock("../../styles/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

// Create mock components
const MockExpandableOrgListItem = () => null;
const MockFlatList = () => null;

// Mock the components
jest.mock("../../components/ExpandableOrgListItem", () => MockExpandableOrgListItem);
jest.mock("react-native/Libraries/Lists/FlatList", () => MockFlatList);

describe("ExpandableOrgList", () => {
  const mockTheme = {
    isDarkMode: false,
    theme: lightTheme,
  };

  const mockAddress = new OrgAddress({
    streetAddress: "123 Test St",
    suburb: "Test Suburb",
    city: "Test City",
    province: "Test Province",
    postalCode: "12345",
  });

  const mockOrgs = [
    new Organisation({
      org_id: "1",
      orgName: "Test Org 1",
      orgAddress: mockAddress,
      orgEmail: "test1@example.com",
      orgPhoneNo: "1234567890",
      orgLatitude: -33.9,
      orgLongitude: 18.4,
    }),
    new Organisation({
      org_id: "2",
      orgName: "Test Org 2",
      orgAddress: mockAddress,
      orgEmail: "test2@example.com",
      orgPhoneNo: "0987654321",
      orgLatitude: -33.8,
      orgLongitude: 18.5,
    }),
  ];

  const mockOnListButtonClicked = jest.fn();
  const mockListButton = (
    <CustomButton title="Test Button" onPress={() => {}} testID="list-button" />
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
  });

  it("renders list container with correct styles", () => {
    const { getByTestId } = render(
      <ExpandableOrgList
        items={mockOrgs}
        listButtonComp={mockListButton}
        onListButtonClicked={mockOnListButtonClicked}
        testID="org-list"
      />,
    );

    const container = getByTestId("org-list");
    const styles = container.props.style;
    expect(styles[0]).toEqual(expect.objectContaining({ borderRadius: 30 }));
    expect(styles[1]).toEqual(expect.objectContaining({ backgroundColor: lightTheme.orgListOdd }));
  });

  it("passes correct props to FlatList", () => {
    const { UNSAFE_getByType } = render(
      <ExpandableOrgList
        items={mockOrgs}
        listButtonComp={mockListButton}
        onListButtonClicked={mockOnListButtonClicked}
      />,
    );

    const flatList = UNSAFE_getByType(MockFlatList);
    expect(flatList.props.data).toEqual(mockOrgs);
  });

  it("handles empty items array", () => {
    const { queryByTestId } = render(
      <ExpandableOrgList
        items={[]}
        listButtonComp={mockListButton}
        onListButtonClicked={mockOnListButtonClicked}
        testID="org-list"
      />,
    );

    const container = queryByTestId("org-list");
    expect(container).toBeTruthy();
  });
});
