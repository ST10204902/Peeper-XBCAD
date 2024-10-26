import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SearchBarComponent from "./GeneralInputComponent";
import CustomButton from "./CustomButton";
import { OrgRequestData } from "../databaseModels/OrgRequestData";

interface Props {
  request: {
    location: string;
    orgName: string;
    phoneNo: string;
    email: string;
  };
  onOk: () => void;
}

/**
 * DuplicateRequestPopup component is used to inform the user when a request for adding an organization has already been submitted by another student.
 * It displays the details of the existing request and allows the user to confirm if those details are correct.
 * The component also warns the user that their request will be linked to the displayed details, and if incorrect, they should contact their lecturer.
 *
 * @component
 * @param {Object} request - The existing organization request data (including location, organization name, phone number, and email address).
 * @param {Function} onOk - Callback function triggered when the "OK" button is pressed.
 * @returns {JSX.Element} The rendered duplicate request popup.
 *
 * @example
 * <DuplicateRequestPopup
 *   request={{ location: "Location A", orgName: "Org A", phoneNo: "123456789", email: "example@email.com" }}
 *   onOk={handleOkPress}
 * />
 *
 * @remarks
 * - Displays key details of an organization request submitted by another student.
 * - Provides the user with an option to acknowledge the duplicate request by pressing the "OK" button.
 * - If the request is null or empty, the component logs an error and does not render.
 */
export default function DuplicateRequestPopup({ request, onOk }: Props) {
  // Don't render if request is null or empty
  if (!request) {
    console.error("DuplicateRequestPopup: request was null or empty");
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>OOPS!</Text>
        <Text style={styles.explanation}>
          It looks like another student has already requested for this
          organisation to be added. you will be notified once the request approval status changes.
        </Text>
        <Text style={styles.explanation_p2}>Are these details correct?</Text>
        <View style={styles.details_container}>
          <Text style={styles.request_detail}>
            <Text style={styles.detail_emphasis}>{"Organisation: "}</Text>
            {request.orgName}
          </Text>
          <Text style={styles.request_detail}>
            <Text style={styles.detail_emphasis}>{"Phone number: "}</Text>
            {request.phoneNo}
          </Text>
          <Text style={styles.request_detail}>
            <Text style={styles.detail_emphasis}>{"Email Address: "}</Text>
            {request.email}
          </Text>
          <Text style={styles.request_detail}>
            <Text style={styles.detail_emphasis}>{"Location: "}</Text>
            {request.location}
          </Text>
          <Text style={styles.warning_message}>
            Your request will be linked to the above details. If they are
            incorrect, contact your lecturer.
          </Text>
          <View style={styles.button_container}>
            <CustomButton
              onPress={onOk}
              title="OK"
              textColor="#161616"
              buttonColor="#A4DB51"
              fontFamily="Quittance"
              textSize={20}
              addFlex={true}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  body: {
    color: "#161616",
    width: "95%",
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 35,
    color: "#161616",
    marginBottom: 15,
    fontFamily: "Quittance", // Change font if needed
  },
  explanation: {
    fontFamily: "Rany-Medium",
    fontSize: 16,
  },
  explanation_emphasis: {
    fontFamily: "Inter-Black",
    fontSize: 24,
  },
  explanation_p2: {
    marginTop: 20,
    fontFamily: "Rany-Bold",
    fontSize: 25,
    textAlign: "center",
  },
  details_container: {
    marginTop: 5,
    alignItems: "center",
    gap: 5,
  },
  request_detail: {
    textAlign: "center",
    fontFamily: "Rany-Regular",
    fontSize: 15,
    paddingHorizontal: 10,
  },
  detail_emphasis: {
    fontFamily: "Rany-Medium",
    fontSize: 17,
  },
  button_container: {
    marginTop: 10,
    height: 50,
    width: 150,
  },
  warning_message: {
    marginTop: 26,
    fontFamily: "Inter-Black",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 20,
  },
});
