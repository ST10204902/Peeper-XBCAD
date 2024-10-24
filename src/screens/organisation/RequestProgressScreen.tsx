import { StyleSheet, Text, View } from "react-native";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import useOrgRequests from "../../hooks/useOrgRequests";
import { ApprovalStatus } from "../../databaseModels/enums";
import { ScrollView } from "react-native-gesture-handler";

/**
 * RequestProgressScreen component renders the progress of the user's organisation approval requests.
 *
 * This component displays the status of each organisation approval request associated with the current student.
 * Users can view each organisation's name, address, and approval status (pending, approved, or denied).
 *
 * @component
 * @returns {JSX.Element} The rendered RequestProgressScreen component.
 *
 * @example
 * // Usage example:
 * <RequestProgressScreen />
 *
 * @remarks
 * - Displays a list of organisation requests with their status.
 * - Retrieves the current student and their organisation requests using custom hooks (`useCurrentStudent` and `useOrgRequests`).
 * - Uses conditional rendering for status messages based on approval status.
 *
 * @function
 * @name RequestProgressScreen
 *
 * @hook
 * @name useCurrentStudent
 * @description Retrieves the current logged-in student data.
 *
 * @hook
 * @name useOrgRequests
 * @description Fetches organisation requests based on the student's ID.
 *
 * @callback getApprovalStatus
 * @description Converts the approval status number to a human-readable status message and applies appropriate styles.
 *
 * @state {Student | undefined} currentStudent - The current student's data.
 * @state {OrganisationData[]} orgRequests - List of organisation requests associated with the student.
 */

export default function RequestProgressScreen() {
  const { currentStudent } = useCurrentStudent();
  const orgRequests = useOrgRequests(currentStudent?.student_id || "");

  // Render Loading component if still loading
  if (!currentStudent) {
    return <Text>Loading student data...</Text>;
  }

  // Function to get the approval status view for the corresponding approval status
  const getApprovalStatus = (status: number): React.ReactElement => {
    switch (status) {
      case ApprovalStatus.Pending:
        return (
          <View style={styles.status_pending}>
            <Text style={styles.status_message}>Pending...</Text>
          </View>
        );
      case ApprovalStatus.Denied:
        return (
          <View style={styles.status_denied}>
            <Text style={styles.status_message}>Denied</Text>
          </View>
        );
      case ApprovalStatus.Approved:
        return (
          <View style={styles.status_approved}>
            <Text style={styles.status_message}>Approved</Text>
          </View>
        );
      default:
        return (
          <View style={styles.status_denied}>
            <Text style={styles.status_message}>Unknown</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.page_container}>
      <Text style={styles.header}>REQUEST PROGRESS</Text>
      <ScrollView contentContainerStyle={styles.scroll_view}>
        <View style={styles.requests_container}>
          {orgRequests.map((request, i) => (
            <View key={request.request_id} style={styles.itemContainerEven}>
              <View style={styles.firstRow}>
                <Text
                  style={styles.orgName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {request.name}
                </Text>
                <Text
                  style={styles.distance}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  xkm away
                </Text>
              </View>

              <Text
                style={styles.addressRow}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {`${request.orgAddress.streetAddress}, ${request.orgAddress.suburb}, ${request.orgAddress.city}, ${request.orgAddress.province}, ${request.orgAddress.postalCode}`}
              </Text>

              <View style={styles.buttonContainer}>
                {getApprovalStatus(request.approvalStatus)}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page_container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontFamily: "Quittance",
    marginBottom: 30,
  },
  requests_container: {
    borderRadius: 30,
    width: "95%",
  },
  itemContainerEven: {
    paddingVertical: 20,
    backgroundColor: "#F3F3F3",
    borderRadius: 25,
    marginBottom: 20,
  },
  firstRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  orgName: {
    paddingStart: 30,
    fontFamily: "Rany-Bold",
    letterSpacing: 1,
    color: "#5A5A5A",
    fontSize: 20,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  addressRow: {
    color: "#5A5A5A",
    fontFamily: "Rany-Medium",
    marginVertical: 10,
    marginHorizontal: 40,
    fontSize: 15,
    alignSelf: "center",
  },
  distance: {
    color: "#696969",
    marginEnd: 11,
    fontFamily: "Rany-Medium",
    fontSize: 17,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    paddingHorizontal: 70,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  status_pending: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#FE7143",
  },
  status_approved: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#A4DB51",
  },
  status_denied: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#EA4B4B",
  },
  status_message: {
    fontFamily: "Rany-Bold",
    fontSize: 16,
  },
  scroll_view: {
    paddingBottom: 40,
    alignItems: "center",
  },
});
// End of File
