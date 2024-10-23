import { Text, View } from "react-native";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import useOrgRequests from "../../hooks/useOrgRequests";
import { ApprovalStatus } from "../../databaseModels/enums";

/**
 * Screen Component where the user can request the progress of their organisation approval
 * @returns a created RequestProgressScreen Component
 */
export default function RequestProgressScreen() {
  const { currentStudent } = useCurrentStudent();
  const orgRequests = useOrgRequests(currentStudent?.student_id ? currentStudent.student_id : '');

  if (!currentStudent) {
    return <Text>Loading student data...</Text>;
  }

  // Function to convert approvalStatus to string
  const getApprovalStatusString = (status: number): string => {
    switch (status) {
      case ApprovalStatus.Pending:
        return "Pending";
      case ApprovalStatus.Denied:
        return "Denied";
      case ApprovalStatus.Approved:
        return "Approved";
      default:
        return "Unknown";
    }
  };
  

  return (
    <View>
      <Text>Org Requests for {currentStudent.studentNumber}:</Text>
      {orgRequests.map((request) => (
        <View key={request.request_id}>
          <Text>Name: {request.name}</Text>
          <Text>Status: {getApprovalStatusString(request.approvalStatus)}</Text>
          {/* Render other details as needed */}
        </View>
      ))}
    </View>
  );
}
// End of File
