// firebase-config.js

// 1. IMPORT MODUL FIREBASE DARI CDN
// Kita mengimpor semua fungsi yang dibutuhkan oleh login, CRUD siswa, absensi, dan dokumentasi
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    set,
    update,
    push,
    child,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// 2. KONFIGURASI FIREBASE ANDA
// PENTING: Ganti nilai-nilai di dalam tanda kutip dengan data dari Firebase Console Anda!
const firebaseConfig = {
    apiKey: "AIzaSyCve7L0MUM0ojQssdeZx6p53DlrMYa15wQ",
    authDomain: "absen-6b1c9.firebaseapp.com",
    databaseURL: "https://absen-6b1c9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "absen-6b1c9",
    storageBucket: "absen-6b1c9.firebasestorage.app",
    messagingSenderId: "165884053879",
    appId: "1:165884053879:web:fb437d7325b9b631403972",
    measurementId: "G-824WNLXM00"                                       // Ganti dengan format 1:xxxxx:web:yyyyy
};

// 3. INISIALISASI APLIKASI DAN DATABASE
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 4. EKSPOR FUNGSI
// Ekspor ini wajib agar file login.js, data-siswa.js, absensi.js, dan dokumentasi.js bisa menggunakan Firebase
export { db, ref, get, set, update, push, child, onValue, remove };

