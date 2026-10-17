// Mengimpor fungsi dari firebase-config.js
import { db, ref, get, child } from './firebase-config.js';

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah halaman refresh otomatis

    // Mengambil nilai dari inputan
    const inputUsername = document.getElementById('username').value;
    const inputPassword = document.getElementById('password').value;

    errorMessage.textContent = 'Memeriksa data...'; // Pesan loading sementara

    try {
        const dbRef = ref(db);
        // Mengambil snapshot dari node "users" di Realtime Database
        const snapshot = await get(child(dbRef, 'users'));

        if (snapshot.exists()) {
            const users = snapshot.val();
            let isAuthenticated = false;

            // Looping untuk mencocokkan data
            for (const key in users) {
                if (users[key].username === inputUsername && users[key].password === inputPassword) {
                    isAuthenticated = true;
                    break;
                }
            }

            if (isAuthenticated) {
                errorMessage.style.color = "green";
                errorMessage.textContent = 'Login berhasil! Mengalihkan...';

                // Menyimpan sesi login di browser (hilang kalau tab ditutup)
                sessionStorage.setItem('isLoggedIn', 'true');

                // Mengarahkan ke halaman utama (dashboard)
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                errorMessage.style.color = "#dc3545";
                errorMessage.textContent = 'Username atau password salah!';
            }
        } else {
            errorMessage.style.color = "#dc3545";
            errorMessage.textContent = 'Database kosong atau node users tidak ditemukan.';
        }
    } catch (error) {
        console.error("Error Firebase:", error);
        errorMessage.style.color = "#dc3545";
        errorMessage.textContent = 'Terjadi kesalahan koneksi internet atau server.';
    }
});