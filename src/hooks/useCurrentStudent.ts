import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo'; // Adjust according to your authentication library
import { onValue } from 'firebase/database';
import { StudentData } from '../databaseModels/StudentData';
import { Student } from '../databaseModels/databaseClasses/Student';
import { DatabaseUtility } from '../utils/DatabaseUtility';

type UseCurrentStudentResult = {
  currentStudent: Student | null;
  error: Error | null;
  loading: boolean;
  saving: boolean;
  updateCurrentStudent: (updates: Partial<StudentData>) => Promise<void>;
};

export function useCurrentStudent(): UseCurrentStudentResult {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const { user } = useUser(); // Get the current user

  useEffect(() => {
    if (!user) {
      setError(new Error('User not authenticated'));
      setLoading(false);
      return;
    }

    const ref = DatabaseUtility.getRef(`students/${user.id}`);

    // Set up the listener
    const unsubscribe = onValue(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const student = new Student(data);
          setCurrentStudent(student);
        } else {
          setCurrentStudent(null);
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [user]);

  const updateCurrentStudent = async (updates: Partial<StudentData>) => {
    if (!currentStudent) {
      setError(new Error('No current student to update'));
      return;
    }
    setSaving(true);
    try {
      await currentStudent.update(updates);
      // No need to manually update currentStudent; listener will handle it
      setSaving(false);
    } catch (err) {
      setError(err as Error);
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
