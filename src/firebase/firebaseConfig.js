
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC79dLUv5wmpvYmreVMDS0KMFcmw-RUEMk",
  authDomain: "peeper-xbcad.firebaseapp.com",
  projectId: "peeper-xbcad",
  storageBucket: "peeper-xbcad.appspot.com",
  messagingSenderId: "761357003841",
  appId: "1:761357003841:web:97de31e23cc0c0f449aac0",
  measurementId: "G-8K27P2SQER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, analytics, database };