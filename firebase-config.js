// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCve7L0MUM0ojQssdeZx6p53DlrMYa15wQ",
  authDomain: "absen-6b1c9.firebaseapp.com",
  databaseURL: "https://absen-6b1c9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "absen-6b1c9",
  storageBucket: "absen-6b1c9.firebasestorage.app",
  messagingSenderId: "165884053879",
  appId: "1:165884053879:web:fb437d7325b9b631403972",
  measurementId: "G-824WNLXM00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
