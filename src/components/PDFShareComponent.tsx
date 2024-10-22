import * as React from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { logoBase64 } from "../assets/logoBase64";
import { useUser } from "@clerk/clerk-expo";
import { Student } from "../databaseModels/databaseClasses/Student";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import CustomButton from "./CustomButton";
import memoizeOne from "memoize-one";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!;

/**
 * Calculate the distance between two latitude and longitude coordinates using the Haversine formula.
 * @param lat1 - The latitude of the first point.
 * @param lon1 - The longitude of the first point.
 * @param lat2 - The latitude of the second point.
 * @param lon2 - The longitude of the second point.
 * @returns Distance in kilometers between the two points.
 */
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
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

/**
 * Calculate the zoom level for a Google Maps static image based on the spread of location data.
 * @param locationLogs - An array of location logs containing latitude and longitude coordinates.
 * @returns Calculated zoom level for the static map image. Between 10 and 16.
 */
const calculateZoomLevel = (locationLogs: Array<LocationLog>) => {
  const latitudes = locationLogs.map((pin) => parseFloat(pin.latitude.toString()));
  const longitudes = locationLogs.map((pin) => parseFloat(pin.longitude.toString()));

  const maxLat = Math.max(...latitudes);
  const minLat = Math.min(...latitudes);
  const maxLng = Math.max(...longitudes);
  const minLng = Math.min(...longitudes);

  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;

  const largestDiff = Math.max(latDiff, lngDiff);

  // Approximate zoom level based on the difference in coordinates
  if (largestDiff > 1.0) {
    return 10; // Zoomed out for larger area
  } else if (largestDiff > 0.5) {
    return 12;
  } else if (largestDiff > 0.1) {
    return 14;
  } else {
    return 16; // Zoomed in for smaller area
  }
};

/**
 * Calculate the minimum and maximum distance between two location logs in a given array.
 * @param locationLogs - An array of location logs containing latitude and longitude coordinates.
 * @returns Object containing the minimum and maximum distances in meters.
 */
const getMinAndMaxDistance = (locationLogs: Array<LocationLog>) => {
  let minDistance = Number.MAX_VALUE;
  let maxDistance = Number.MIN_VALUE;
  for (let i = 0; i < locationLogs.length - 1; i++) {
    const pin1 = locationLogs[i];
    const pin2 = locationLogs[i + 1];

    const pin1Latitude = pin1.latitude;
    const pin1Longitude = pin1.longitude;
    const pin2Latitude = pin2.latitude;
    const pin2Longitude = pin2.longitude;

    let currentDistance = haversineDistance(
      pin1Latitude,
      pin1Longitude,
      pin2Latitude,
      pin2Longitude
    );

    if (currentDistance < minDistance) {
      minDistance = currentDistance;
    }
    if (currentDistance > maxDistance) {
      maxDistance = currentDistance;
    }
  }
  // Convert km to meters
  minDistance = minDistance * 1000;
  maxDistance = maxDistance * 1000;
  return { minDistance, maxDistance };
};

/**
 * Convert HSL color to RGB color.
 * @param h - Hue value (0-360).
 * @param s - Saturation value (0-1).
 * @param l - Lightness value (0-1).
 * @returns Array of RGB values.
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; // Convert hue to a fraction between 0 and 1
  let r: number, g: number, b: number;

  if (s === 0) {
    // Achromatic (grey)
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p: number = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Generate a colour based on the distance between two location logs.
 * @param distance - Distance between two location logs in kilometers.
 * @param minDistance - Minimum distance between two location logs in kilometers.
 * @param maxDistance - Maximum distance between two location logs in kilometers.
 * @returns Hexadecimal colour string.
 */
const getColorBasedOnDistance = (
  distance: number,
  minDistance: number,
  maxDistance: number
): string => {
  distance = distance * 1000; // Convert distance to meters
  const ratio: number = (distance - minDistance) / (maxDistance - minDistance);
  const hue: number = (1 - ratio) * 120; // Map ratio to hue from 120° (green) to 0° (red)
  const [r, g, b] = hslToRgb(hue, 1, 0.5); // Full saturation and 50% lightness

  return `0x${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

/**
 * Generate a static Google Maps image URL based on location data.
 * @param locationLogs - An array of location logs containing latitude and longitude coordinates.
 * @param apiKey - Google Maps API key.
 * @returns URL for the static Google Maps image.
 */
const generateStaticMapURL = (
  locationLogs: Array<LocationLog>,
  apiKey: string
): string => {
  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?";

  // Calculate the center of the map based on the average latitude and longitude
  const avgLat =
    locationLogs.reduce((sum, pin) => sum + parseFloat(pin.latitude.toString()), 0) /
    locationLogs.length;
  const avgLng =
    locationLogs.reduce(
      (sum, pin) => sum + parseFloat(pin.longitude.toString()),
      0
    ) / locationLogs.length;
  const center = `center=${avgLat},${avgLng}`;

  // Dynamically calculate zoom level based on location data spread
  const zoom = `zoom=${calculateZoomLevel(locationLogs)}`;
  const size = "size=600x400";
  const mapType = "maptype=roadmap";

  const { minDistance, maxDistance } = getMinAndMaxDistance(locationLogs);

  // Generate polyline path to connect the pins with varying colors
  const pathSegments = [];
  for (let i = 0; i < locationLogs.length - 1; i++) {
    const pin1 = locationLogs[i];
    const pin2 = locationLogs[i + 1];
    const pin1Latitude = Number(pin1.latitude);
    const pin1Longitude = Number(pin1.longitude);
    const pin2Latitude = Number(pin2.latitude);
    const pin2Longitude = Number(pin2.longitude);

    const distance = haversineDistance(
      pin1Latitude,
      pin1Longitude,
      pin2Latitude,
      pin2Longitude
    );

    const color = getColorBasedOnDistance(distance, minDistance, maxDistance);
    pathSegments.push(
      `path=color:${color}|weight:2|${pin1.latitude},${pin1.longitude}|${pin2.latitude},${pin2.longitude}`
    );
  }
  const path = pathSegments.join("&");

  // Generate the markers parameter for each pin with labels showing the count
  const markers = locationLogs.map(
    (pin, index) =>
      `markers=color:red%7Clabel:${index + 1}%7C${pin.latitude},${
        pin.longitude
      }`
  ).join("&");
  const fullURL = `${baseUrl}${center}&${zoom}&${size}&${mapType}&${path}&${markers}&key=${apiKey}`;
  return `${baseUrl}${center}&${zoom}&${size}&${mapType}&${path}&${markers}&key=${apiKey}`;
};

/**
 * Calculate the average speed between location logs in kilometers per hour.
 * @param locationLogs - Array of location logs.
 * @returns Average speed in km/h.
 */
const calculateAverageSpeed = memoizeOne((locationLogs: Array<LocationLog>): number => {
  if (locationLogs.length < 2) return 0;

  let totalDistance = 0; // in kilometers
  let totalTime = 0; // in hours

  for (let i = 1; i < locationLogs.length; i++) {
    const prevLog = locationLogs[i - 1];
    const currLog = locationLogs[i];

    // Calculate distance between the two points
    const distance = haversineDistance(
      parseFloat(prevLog.latitude.toString()),
      parseFloat(prevLog.longitude.toString()),
      parseFloat(currLog.latitude.toString()),
      parseFloat(currLog.longitude.toString())
    );
    totalDistance += distance;

    // Calculate time difference in hours
    const timeDiffMs =
      new Date(currLog.timestamp).getTime() -
      new Date(prevLog.timestamp).getTime();
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
    totalTime += timeDiffHours;
  }

  // Calculate average speed (distance/time)
  const averageSpeed = totalTime > 0 ? totalDistance / totalTime : 0;
  return Math.round(averageSpeed * 100) / 100; // Return speed rounded to 2 decimal places
});

/**
 * Generate an HTML report for a student's location data.
 * @param student - The student object containing location data.
 * @param logoBase64 - Base64 encoded logo image.
 * @returns HTML content for the report.
 */
async function testHTML(student: Student, logoBase64: string): Promise<string> {
  let htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    
        <style>
          @page {
            size: A4;
            margin: 20mm;
            @bottom-right {
              content: "Page " counter(page) " of " counter(pages);
              font-size: 12px;
              color: #666;
            }
          }
  
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 10mm;
            background-color: #f0f0f0;
            text-align: left;
            position: relative;
            counter-increment: page;
          }
  
          /* Header */
          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #000;
            margin-bottom: 20px;
          }
  
          .report-title {
            font-size: 32px;
            font-weight: 500;
          }
  
          .date-generated {
            font-size: 16px;
            color: #666;
          }
  
          /* Organisation Details */
          .details-container {
            display: grid;
            grid-template-columns: 1fr 2fr 2fr;
            gap: 10px;
            margin-top: 20px;
            padding-bottom: 20px;
            margin-left: 20px;
            border-bottom: 1px solid #000;
            font-size: 16px;
          }
  
          .details-container div {
            padding: 5px 0;
          }
  
          .descriptor {
            font-weight: 500;
          }
  
          /* Map container with square aspect ratio */
          .maps-container {
            margin-top: 20px;
            border-radius: 16px;
            border: 2px solid #ccc;
            overflow: hidden;
            height: 400px; /* More square-like map */
            width: 100%;
            margin-bottom: 20px;
          }
  
          .google-maps-image {
            width: 100%;
            height: 100%; /* Adjust height to make the map more square */
            object-fit: cover;
          }
  
          /* Speed and Pin Count below the map */
          .map-details-container {
            font-size: 16px;
            color: #666;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
          }
  
          /* Page break to ensure each session starts on a new page */
          .page-break {
            page-break-before: always;
          }
        </style>
      </head>
      <body>
        <header class="header-container">
          <div>
            <div class="report-title"> ${student.studentNumber} Report </div>
            <div class="date-generated"> Date Generated: ${new Date().toLocaleDateString()} </div>
          </div>
          <img src="${logoBase64}" class="logo" />
        </header>
    `;

  // Iterate over the sessions and create a new page for each one (up to 4)
  if (student.locationData && typeof student.locationData === "object") {
    const sessions = Object.values(student.locationData).slice(0, 4);

    // Fetch all organization data in parallel
    const orgPromises = sessions.map((session) =>
      Organisation.fetchById(session.orgID)
    );
    const orgObjects = await Promise.all(
      orgPromises.map((p) => p.catch((e) => null))
    );

    for (let index = 0; index < Math.min(4, sessions.length); index++) {
      const session = sessions[index];
      const orgObj = orgObjects[index];

      //Parse start and end times
      const startTime = new Date(session.sessionStartTime);
      const endTime = new Date(session.sessionEndTime);

      const durationMs = endTime.getTime() - startTime.getTime();
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor(
        (durationMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      const durationString = `${durationHours} hours, ${durationMinutes} minutes`;

      const numPins = session.locationLogs.length;
      const avgSpeed = calculateAverageSpeed(session.locationLogs);

      const mapURL = generateStaticMapURL(
        session.locationLogs,
        GOOGLE_MAPS_API_KEY
      );

      // Concatenate HTML content
      htmlContent += `
      <div class="details-container">
        <div class="descriptor">Organisation:</div>
        <div class="data">${orgObj?.orgName ?? "N/A"}</div>
        <div class="address">${orgObj?.orgAddress?.streetAddress ?? "N/A"}</div>

        <div class="descriptor">Start Time:</div>
        <div class="data">${session.sessionStartTime ?? "N/A"}</div>
        <div class="address">${orgObj?.orgAddress?.suburb ?? "N/A"}</div>

        <div class="descriptor">End Time:</div>
        <div class="data">${session.sessionEndTime ?? "N/A"}</div>
        <div class="address">${orgObj?.orgAddress?.city ?? "N/A"}</div>

        <div class="descriptor">Duration:</div>
        <div class="data">${durationString ?? "N/A"}</div>
        <div class="address">${orgObj?.orgAddress?.postalCode ?? "N/A"}</div>
      </div>

      <div class="maps-container">
        <img src="${mapURL}" class="google-maps-image" />
      </div>

      <div class="map-details-container">
        <div>Number of Pins: ${numPins}</div>
        <div>Average Speed: ${avgSpeed} km/h</div>
      </div>

      <div class="page-break"></div>
    `;
    }
  } else {
    console.error("Failed to generate HTML");
  }

  htmlContent += `</body></html>`;
  return htmlContent;
}

/**
 * Component to share a PDF report of a student's location data.
 * @returns React component
 */
export default function PDFShareComponent() {
  const [currentStudent, setCurrentStudent] = React.useState<Student | null>(
    null
  );
  const user = useUser() ?? null;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCurrentStudent = async (): Promise<Student | null> => {
    if (user?.user?.id) {
      try {
        setLoading(true);
        const student = await Student.fetchById(user.user.id);
        setCurrentStudent(student);
        return student;
      } catch (error) {
        console.error("Error fetching student:", error);
        Alert.alert("Error", "Failed to fetch student data.");
        return null;
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "User not authenticated.");
      return null;
    }
  };

  /**
   * Print the student's location data to a PDF file and share it.
   * If the student or location data is not available, an error message is displayed.
   * If the sharing process fails, an error message is displayed.
   * If the process is successful, the loading state is set to false.
   * @returns {Promise<void>}
   */
  const printToFile = async () => {
    try {
      const student = await fetchCurrentStudent();
      if (!student) {
        setError("Current student data is not available.");
        Alert.alert("Error", "Current student data is not available.");
      } else if (!student.locationData) {
        setError("No location data available.");
        Alert.alert("Error", "No location data available.");
      } else {
        setError(null);
        setLoading(true);
        const htmlContent = await testHTML(student, logoBase64);

        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
      }
    } catch (error) {
      console.error("Failed to print to file", error);
      setError("Failed to print to file.");
      Alert.alert("Error", "Failed to print to file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>{error}</Text>}
      <CustomButton
        title="EXPORT TRACKING INFORMATION"
        fontFamily="Quittance"
        textColor="#161616"
        buttonColor="#D9E7FF"
        textSize={20}
        onPress={printToFile}
        disabled={loading}
      />
    </View>
  );
}
