import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Linking } from "react-native";
import EmergencyContacts from "../../components/EmergencyContacts";

// Mock the Linking module
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(),
}));

// Mock expo-linear-gradient
jest.mock("expo-linear-gradient", () => {
  const mockComponent = "LinearGradient";
  return { LinearGradient: mockComponent };
});

describe("EmergencyContacts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all emergency contact numbers", () => {
    const { getByText } = render(<EmergencyContacts />);

    expect(getByText(/112/)).toBeTruthy();
    expect(getByText(/10111/)).toBeTruthy();
    expect(getByText(/10177/)).toBeTruthy();
  });

  it("renders header and description", () => {
    const { getByText } = render(<EmergencyContacts />);

    expect(getByText("Safety First 🚨")).toBeTruthy();
    expect(getByText("EMERGENCY CONTACTS")).toBeTruthy();
    expect(getByText("Know your emergency numbers!")).toBeTruthy();
  });

  it("calls Linking.openURL with correct phone number for emergency", () => {
    const { getByTestId } = render(<EmergencyContacts />);
    const emergencyButton = getByTestId("emergency-button");

    fireEvent.press(emergencyButton);
    expect(Linking.openURL).toHaveBeenCalledWith("tel:112");
  });

  it("calls Linking.openURL with correct phone number for police", () => {
    const { getByTestId } = render(<EmergencyContacts />);
    const policeButton = getByTestId("police-button");

    fireEvent.press(policeButton);
    expect(Linking.openURL).toHaveBeenCalledWith("tel:10111");
  });

  it("calls Linking.openURL with correct phone number for ambulance", () => {
    const { getByTestId } = render(<EmergencyContacts />);
    const ambulanceButton = getByTestId("ambulance-button");

    fireEvent.press(ambulanceButton);
    expect(Linking.openURL).toHaveBeenCalledWith("tel:10177");
  });
});
