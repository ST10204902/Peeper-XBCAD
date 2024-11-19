import { Student } from "../databaseModels/databaseClasses/Student";

class MyMaths {
  /**
   * Calculates the total logged hours for a given student.
   *
   * @param {Student} student - The student object containing location data with session logs.
   * @returns {number} The total number of hours logged by the student.
   */
  static calculateTotalLoggedHours(student: Student): number {
    let totalHours = 0;

    Object.values(student.locationData).forEach(sessionLog => {
      const sessionStartTime = new Date(sessionLog.sessionStartTime);
      const sessionEndTime = sessionLog.sessionEndTime
        ? new Date(sessionLog.sessionEndTime)
        : sessionStartTime; // If session end time is not set, use start time
      // Calculate the difference in hours between session start and end time
      const sessionDurationMs = sessionEndTime.getTime() - sessionStartTime.getTime();
      const sessionDurationHours = sessionDurationMs / (1000 * 60 * 60); // Convert milliseconds to hours

      totalHours += sessionDurationHours;
    });

    return totalHours;
  }

  /**
   * Calculate the distance between two latitude and longitude coordinates using the Haversine formula.
   * @param lat1 - The latitude of the first point.
   * @param lon1 - The longitude of the first point.
   * @param lat2 - The latitude of the second point.
   * @param lon2 - The longitude of the second point.
   * @returns Distance in kilometers between the two points.
   */
  static haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
  };
}

export default MyMaths;
