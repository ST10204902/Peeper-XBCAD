import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react'; // Assuming you are using Clerk's useUser hook
import { Student } from '../databaseModels/databaseClasses/Student';

export function useStudent() {
  const { user } = useUser(); // Get the authenticated user from Clerk
  const [currentStudent, setCurrentStudentState] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);


// Custom setter function that calls student.save() whenever the student state is updated
const setCurrentStudent = useCallback(async (student: Student | null) => {
    try {
      if (student) {
        await student.save(); // Save the student whenever setCurrentStudent is called
        console.log("Student saved successfully.");
      }
      setCurrentStudentState(student); // Update the state after saving
    } catch (saveError) {
      console.error("Error saving student:", saveError);
      setError("Error saving student.");
    }
  }, []);


  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!user) {
          const errorMessage = "Clerk user not found";
          console.error("useStudent hook:", errorMessage);
          setError(errorMessage);
          // Optionally handle navigation to login screen here
          return;
        }

        console.log("Fetching student with user ID:", user.id);
        const student = await Student.fetchById(user.id);

        if (!student) {
          const errorMessage = "Student not found";
          console.error("useStudent hook:", errorMessage);
          setError(errorMessage);
          return;
        }

        setCurrentStudent(student);
      } catch (fetchError) {
        const errorMessage = "Error fetching student data";
        console.error("useStudent hook:", fetchError);
        setError(errorMessage);
      }
    };

    fetchStudent();
  }, [user]);

  return { currentStudent, setCurrentStudent, error };
}
