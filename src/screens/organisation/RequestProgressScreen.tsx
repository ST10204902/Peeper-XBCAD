import { StyleSheet, Text, View } from "react-native";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import useOrgRequests from "../../hooks/useOrgRequests";
import { ApprovalStatus } from "../../databaseModels/enums";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../styles/ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import { Colors } from "../../styles/colors";

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
  const studentId = currentStudent?.student_id?.toLowerCase() ?? "";
  const orgRequests = useOrgRequests(studentId);

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  if (!currentStudent) {
    return <Text>Loading student data...</Text>;
  }

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
    <View style={[styles.page_container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.fontRegular }]}>REQUEST PROGRESS</Text>
      <ScrollView contentContainerStyle={styles.scroll_view}>
        <View style={styles.requests_container}>
          {orgRequests.map(request => (
            <View
              key={request.request_id}
              style={[styles.itemContainerEven, { backgroundColor: theme.componentBackground }]}
            >
              <View style={styles.firstRow}>
                <Text
                  style={[styles.orgName, { color: theme.fontRegular }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {request.name}
                </Text>
              </View>

              <Text
                style={[styles.addressRow, { color: theme.fontRegular }]}
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
    backgroundColor: Colors.pageBackground,
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontFamily: "Quittance",
    marginBottom: 30,
  },
  requests_container: {
    borderRadius: 30,
    width: "97%",
  },
  itemContainerEven: {
    paddingVertical: 20,
    backgroundColor: Colors.itemBackground,
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
    color: Colors.textGray,
    fontSize: 20,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  addressRow: {
    color: Colors.textGray,
    fontFamily: "Rany-Medium",
    marginVertical: 10,
    marginHorizontal: 40,
    fontSize: 15,
    alignSelf: "center",
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
    backgroundColor: Colors.statusPending,
  },
  status_approved: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: Colors.statusApproved,
  },
  status_denied: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: Colors.statusDenied,
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
