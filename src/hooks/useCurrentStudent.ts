import { useEffect, useState } from 'react';// Adjust the import path
import { useAuth, useUser } from '@clerk/clerk-expo'; // Assuming you're using Clerk for authentication
import { onValue, off } from 'firebase/database';
import { StudentData } from '../databaseModels/StudentData';
import { Student } from '../databaseModels/databaseClasses/Student';
import { DatabaseUtility } from '../databaseModels/databaseClasses/DatabaseUtility';

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
  const { user } = useUser(); // Use Clerk's useAuth hook to get the current user

  useEffect(() => {
    let isMounted = true;

    const fetchStudent = async () => {
      if (!user) {
        setError(new Error('User not authenticated'));
        setLoading(false);
        return;
      }

      try {
        const student = await Student.fetchById(user.id);
        if (isMounted) {
          setCurrentStudent(student);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    fetchStudent();

    // Set up a listener for changes to the student data
    const ref = DatabaseUtility.getRef(`students/${user?.id}`);
    const listener = onValue(
      ref,
      (snapshot) => {
        if (isMounted && snapshot.exists()) {
          const data = snapshot.val();
          const student = new Student(data);
          setCurrentStudent(student);
        }
      },
      (error) => {
        if (isMounted) {
          setError(error);
        }
      }
    );

    return () => {
      isMounted = false;
      off(ref); // Remove the listener when the component unmounts
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
      const updatedData = { ...currentStudent.toJSON(), ...updates };
      const updatedStudent = new Student(updatedData);
      setCurrentStudent(updatedStudent);
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