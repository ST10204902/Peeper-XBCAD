interface Admin {
  admin_id: string;
  email: string;
  adminType: number; // Assuming this is an ENUM
  viewableStudents: string[];
}
