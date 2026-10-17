// firebase-config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Ganti baris import pertama (baris ke-2 di file Anda) menjadi ini:
import { getDatabase, ref, get, set, update, push, child, onValue, remove } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// ... [Kode konfigurasi API Key Anda tetap di sini] ...

// Ganti baris export paling bawah menjadi ini:
export { db, ref, get, set, update, push, child, onValue, remove };
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

// Export db dan fungsi database agar bisa dipanggil di file JavaScript lain (misal: login.js, absensi.js)
export { db, ref, get, set, update, push, child };