// absensi.js
import { db, ref, get, child, update } from './firebase-config.js';

const inputTanggal = document.getElementById('tanggal_absen');
const btnLoadAbsen = document.getElementById('btn-load-absen');
const tbodyAbsensi = document.getElementById('tbody-absensi');

// 1. FUNGSI MEMUAT DATA SISWA & ABSENSI
btnLoadAbsen.addEventListener('click', async () => {
    const tanggal = inputTanggal.value;

    // Validasi apakah tanggal sudah diisi
    if (!tanggal) {
        alert("Silakan pilih tanggal terlebih dahulu!");
        return;
    }

    // Tampilkan pesan loading
    tbodyAbsensi.innerHTML = '<tr><td colspan="4" style="text-align: center;">Memuat data...</td></tr>';

    try {
        const dbRef = ref(db);

        // Mengambil data siswa dan data absensi pada tanggal tersebut secara bersamaan
        const [snapshotStudents, snapshotAbsensi] = await Promise.all([
            get(child(dbRef, 'students')),
            get(child(dbRef, `absensi/${tanggal}`))
        ]);

        const dataStudents = snapshotStudents.exists() ? snapshotStudents.val() : {};
        const dataAbsensi = snapshotAbsensi.exists() ? snapshotAbsensi.val() : {};

        tbodyAbsensi.innerHTML = ''; // Bersihkan tabel
        let jumlahAktif = 0;

        // Looping semua siswa
        for (const key in dataStudents) {
            const siswa = dataStudents[key];

            // HANYA tampilkan siswa yang statusnya 'aktif'
            if (siswa.status === 'aktif') {
                jumlahAktif++;

                // Cek apakah siswa ini sudah diabsen hari ini? Jika belum, default ke 'masuk'
                const statusHadir = dataAbsensi[key] || 'masuk';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${siswa.nama_lengkap}</strong></td>
                    <td>${siswa.kelas}</td>
                    <td>
                        <select 
                            style="padding: 5px; border-radius: 4px;" 
                            onchange="window.simpanAbsen('${tanggal}', '${key}', this.value)"
                        >
                            <option value="masuk" ${statusHadir === 'masuk' ? 'selected' : ''}>Masuk</option>
                            <option value="ijin" ${statusHadir === 'ijin' ? 'selected' : ''}>Ijin</option>
                            <option value="sakit" ${statusHadir === 'sakit' ? 'selected' : ''}>Sakit</option>
                            <option value="alfa" ${statusHadir === 'alfa' ? 'selected' : ''}>Alfa</option>
                        </select>
                    </td>
                    <td>
                        <span id="indikator-${key}" style="color: #64748b; font-size: 12px; font-weight: bold;">
                            ${dataAbsensi[key] ? '<span style="color: green;">Tersimpan</span>' : 'Belum diubah'}
                        </span>
                    </td>
                `;
                tbodyAbsensi.appendChild(tr);

                // Jika belum ada data absen sama sekali untuk anak ini, simpan default 'masuk' ke database diam-diam
                if (!dataAbsensi[key]) {
                    window.simpanAbsen(tanggal, key, 'masuk', true);
                }
            }
        }

        // Jika tidak ada siswa yang aktif
        if (jumlahAktif === 0) {
            tbodyAbsensi.innerHTML = '<tr><td colspan="4" style="text-align: center;">Tidak ada siswa dengan status aktif.</td></tr>';
        }

    } catch (error) {
        console.error("Error loading absensi:", error);
        tbodyAbsensi.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Terjadi kesalahan saat memuat data.</td></tr>';
    }
});

// 2. FUNGSI SIMPAN/UPDATE ABSENSI (Dipanggil otomatis saat dropdown diubah)
window.simpanAbsen = async (tanggal, idSiswa, statusKehadiran, isInitial = false) => {
    const indikator = document.getElementById(`indikator-${idSiswa}`);

    // Tampilkan tulisan "Menyimpan..." jika ini perubahan dari user (bukan inisialisasi awal)
    if (indikator && !isInitial) {
        indikator.innerHTML = '<span style="color: #f59e0b;">Menyimpan...</span>';
    }

    try {
        const absenRef = ref(db, `absensi/${tanggal}`);

        // Kita menggunakan update(), bukan set(). 
        // update() hanya akan mengubah data siswa tertentu tanpa menghapus data siswa lain di tanggal yang sama.
        await update(absenRef, {
            [idSiswa]: statusKehadiran
        });

        if (indikator && !isInitial) {
            indikator.innerHTML = '<span style="color: #10b981;">Tersimpan</span>';
        }
    } catch (error) {
        console.error("Gagal menyimpan absen:", error);
        if (indikator && !isInitial) {
            indikator.innerHTML = '<span style="color: #ef4444;">Gagal Simpan</span>';
        }
    }
};