import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { onValue } from "firebase/database";
import { StudentData } from "../databaseModels/StudentData";
import { Student } from "../databaseModels/databaseClasses/Student";
import { DatabaseUtility } from "../utils/DatabaseUtility";

type UseCurrentStudentResult = {
  currentStudent: Student | null;
  error: Error | null;
  loading: boolean;
  saving: boolean;
  updateCurrentStudent: (updates: Partial<StudentData>) => Promise<void>;
};
/**
 * @typedef {Object} UseCurrentStudentResult
 * @property {Student | null} currentStudent - The current student instance
 * @property {Error | null} error - The error state
 * @property {boolean} loading - The loading state
 * @property {boolean} saving - The saving state
 * @property {function} updateCurrentStudent - Function to update the current student
 */

/**
 * Custom hook to manage the current student data
 * @returns {UseCurrentStudentResult} An object containing the current student, error, loading, saving states, and updateCurrentStudent function
 */
export function useCurrentStudent(): UseCurrentStudentResult {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      setError(new Error("User not authenticated"));
      setLoading(false);
      return;
    }

    const ref = DatabaseUtility.getRef(`students/${user.id}`);

    // Set up the listener
    const unsubscribe = onValue(
      ref,
      snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const student = new Student(data);
          setCurrentStudent(student);
        } else {
          setCurrentStudent(null);
        }
        setLoading(false);
      },
      dbError => {
        setError(dbError);
        setLoading(false);
      },
    );

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [user]);

  /**
   * Updates the current student's data
   * @param {Partial<StudentData>} updates - The updates to apply to the current student
   * @returns {Promise<void>}
   */
  const updateCurrentStudent = async (updates: Partial<StudentData>) => {
    if (!currentStudent) {
      setError(new Error("No current student to update"));
      return;
    }
    setSaving(true);
    try {
      await currentStudent.update(updates);
      // No need to manually update currentStudent; listener will handle it
      setSaving(false);
    } catch (updateError) {
      setError(updateError as Error);
      setSaving(false);
    }
  };

  return {
    currentStudent,
    error,
    loading,
    saving,
    updateCurrentStudent,
  };
}
