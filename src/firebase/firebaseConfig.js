/**
 * This file configures and initializes Firebase for the application
 */

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import "firebase/messaging";

/**
 * Your web app's Firebase configuration
 * For Firebase JS SDK v7.20.0 and later, measurementId is optional
 */
const firebaseConfig = {
  /** API key for Firebase */
  apiKey: "AIzaSyC79dLUv5wmpvYmreVMDS0KMFcmw-RUEMk",
  /** Auth domain for Firebase */
  authDomain: "peeper-xbcad.firebaseapp.com",
  /** Database URL for Firebase */
  databaseURL: "https://peeper-xbcad-default-rtdb.europe-west1.firebasedatabase.app",
  /** Project ID for Firebase */
  projectId: "peeper-xbcad",
  /** Storage bucket for Firebase */
  storageBucket: "peeper-xbcad.appspot.com",
  /** Messaging sender ID for Firebase */
  messagingSenderId: "761357003841",
  /** App ID for Firebase */
  appId: "1:761357003841:web:97de31e23cc0c0f449aac0",
  /** Measurement ID for Firebase (optional) */
  measurementId: "G-8K27P2SQER",
};

/** Initialize Firebase */
const app = initializeApp(firebaseConfig);

/** Initialize Firebase Database */
const database = getDatabase(app);

/** Export the initialized Firebase app, database, and configuration */
export { app, database, firebaseConfig };
