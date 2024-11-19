import { useEffect, useState } from "react";
import { OrgRequest } from "../databaseModels/databaseClasses/OrgRequest";
import { useCurrentStudent } from "./useCurrentStudent";

function useOrgRequests(_studentID: string) {
  const [orgRequests, setOrgRequests] = useState<OrgRequest[]>([]);
  const { currentStudent } = useCurrentStudent();

  useEffect(() => {
    if (!currentStudent) return;

    // Set up the listener
    const unsubscribe = OrgRequest.listenToRequestsByStudentId(
      currentStudent.studentNumber,
      setOrgRequests,
    );

    // Clean up the listener when the component unmounts or studentID changes
    return () => {
      unsubscribe();
    };
  }, [currentStudent]);

  return orgRequests;
}

export default useOrgRequests;
