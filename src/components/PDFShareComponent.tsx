import * as React from "react";
import { View, StyleSheet, Button, Platform, Text, Alert } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

import { logoBase64 } from "../assets/logoBase64";
import { StudentData } from "../databaseModels/StudentData";
import { useUser } from "@clerk/clerk-expo";
import { Student } from "../databaseModels/databaseClasses/Student";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

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

const calculateZoomLevel = (PinData: Array<LocationLog>) => {
  const latitudes = PinData.map((pin) => parseFloat(pin.latitude.toString()));
  const longitudes = PinData.map((pin) => parseFloat(pin.longitude.toString()));

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

const getMinAndMaxDistance = (PinData: Array<LocationLog>) => {
  let minDistance = 0;
  let maxDistance = 0;
  for (let i = 0; i < PinData.length - 1; i++) {
    let pin1 = PinData[i];
    if (i === PinData.length - 1) {
      break;
    }
    const pin2 = PinData[i + 1];

    const pin1Latitude =
      typeof pin1.latitude === "number" ? pin1.latitude : Number(pin1.latitude);
    const pin1Longitude =
      typeof pin1.longitude === "number"
        ? pin1.longitude
        : Number(pin1.longitude);
    const pin2Latitude =
      typeof pin2.latitude === "number" ? pin2.latitude : Number(pin2.latitude);
    const pin2Longitude =
      typeof pin2.longitude === "number"
        ? pin2.longitude
        : Number(pin2.longitude);
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
  //convert km to meters
  minDistance = minDistance * 1000;
  maxDistance = maxDistance * 1000;
  return { minDistance, maxDistance };
};

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

const generateStaticMapURL = (
  PinData: Array<LocationLog>,
  apiKey: string
): string => {
  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?";

  // Calculate the center of the map based on the average latitude and longitude
  const avgLat =
    PinData.reduce((sum, pin) => sum + parseFloat(pin.latitude.toString()), 0) /
    PinData.length;
  const avgLng =
    PinData.reduce(
      (sum, pin) => sum + parseFloat(pin.longitude.toString()),
      0
    ) / PinData.length;
  const center = `center=${avgLat},${avgLng}`;

  // Dynamically calculate zoom level based on location data spread
  const zoom = `zoom=${calculateZoomLevel(PinData)}`;
  const size = "size=600x400";
  const mapType = "maptype=roadmap";

  const { minDistance, maxDistance } = getMinAndMaxDistance(PinData);
  console.log("minDistance", minDistance);
  console.log("maxDistance", maxDistance);

  // Generate polyline path to connect the pins with varying colors
  const pathSegments = [];
  for (let i = 0; i < PinData.length - 1; i++) {
    const pin1 = PinData[i];
    const pin2 = PinData[i + 1];
    const pin1Latitude =
      typeof pin1.latitude === "number" ? pin1.latitude : Number(pin1.latitude);
    const pin1Longitude =
      typeof pin1.longitude === "number"
        ? pin1.longitude
        : Number(pin1.longitude);
    const pin2Latitude =
      typeof pin2.latitude === "number" ? pin2.latitude : Number(pin2.latitude);
    const pin2Longitude =
      typeof pin2.longitude === "number"
        ? pin2.longitude
        : Number(pin2.longitude);

    const distance = haversineDistance(
      pin1Latitude,
      pin1Longitude,
      pin2Latitude,
      pin2Longitude
    );

    const color = getColorBasedOnDistance(distance, minDistance, maxDistance);
    console.log("color", color);
    pathSegments.push(
      `path=color:${color}|weight:2|${pin1.latitude},${pin1.longitude}|${pin2.latitude},${pin2.longitude}`
    );
  }
  const path = pathSegments.join("&");

  // Generate the markers parameter for each pin with labels showing the count
  const markers = PinData.map(
    (pin, index) =>
      `markers=color:red%7Clabel:${index + 1}%7C${pin.latitude},${
        pin.longitude
      }`
  ).join("&");
  const fullURL = `${baseUrl}${center}&${zoom}&${size}&${mapType}&${path}&${markers}&key=${apiKey}`;
  console.log(fullURL);
  return `${baseUrl}${center}&${zoom}&${size}&${mapType}&${path}&${markers}&key=${apiKey}`;
};

// Calculate the average speed between location logs in kilometers per hour
const calculateAverageSpeed = (locationLogs: Array<LocationLog>): number => {
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
};

async function testHTML(
  student: StudentData,
  logoBase64: string
): Promise<string> {
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
  Array.isArray(student.locationData) &&
    student.locationData.slice(0, 4).forEach(async (session, index) => {
      const numPins = session.locationLogs.length;
      const avgSpeed = calculateAverageSpeed(session.locationLogs);
      const orgObj =
        (await Organisation.fetchById(student.locationData[index].orgID)) ||
        null;

      htmlContent += `
        <div class="details-container">
          <div class="descriptor">Organisation:</div>
          <div class="data">${orgObj?.orgName}</div>
          <div class="address">${orgObj?.orgAddress.streetAddress}</div>
  
          <div class="descriptor">Start Time:</div>
          <div class="data">${session.sessionStartTime}</div>
          <div class="address">${orgObj?.orgAddress.suburb}</div>
  
          <div class="descriptor">End Time:</div>
          <div class="data">${session.sessionEndTime}</div>
          <div class="address">${orgObj?.orgAddress.city}</div>
  
          <div class="descriptor">Duration:</div>
          <div class="data">Duration Placeholder</div>
          <div class="address">${orgObj?.orgAddress.postalCode}</div>
        </div>
  
        <div class="maps-container">
          <img src="${
            GOOGLE_MAPS_API_KEY
              ? generateStaticMapURL(session.locationLogs, GOOGLE_MAPS_API_KEY)
              : ""
          }" class="google-maps-image" />
        </div>
  
        <div class="map-details-container">
          <div>Number of Pins: ${numPins}</div>
          <div>Average Speed: ${avgSpeed} km/h</div>
        </div>
  
        <div class="page-break"></div>
      `;
    });

  htmlContent += `</body></html>`;

  return htmlContent;
}

const fetchCurrentStudent = async (userId: string) => {
  return await Student.fetchById(userId);
};

export default function PDFShareComponent() {
  const user = useUser().user;
  const [currentStudent, setCurrentStudent] =
    React.useState<StudentData | null>(null);

  React.useEffect(() => {
    const fetchStudent = async () => {
      if (user?.id) {
        const student = await fetchCurrentStudent(user.id);
        setCurrentStudent(student);
      }
    };
    fetchStudent();
  }, [user]);

  const printToFile = async () => {
    try {
      if (!currentStudent) {
        Alert.alert("Error", "Current student data is not available.");
      } else if (!currentStudent?.locationData) {
        Alert.alert("Error", "No location data available.");
      } else {
        const htmlContent = await testHTML(currentStudent, logoBase64);

        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        console.log("File saved to: ", uri);
        await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
      }
    } catch (error) {
      console.error("Failed to print to file", error);
      Alert.alert("Error", "Failed to print to file.");
    }
  };

  return (
    <View>
      <Button title="Export Data" onPress={printToFile} />
    </View>
  );
}
