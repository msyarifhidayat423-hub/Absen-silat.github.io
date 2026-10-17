import { db, ref, push, set, onValue, update, remove } from './firebase-config.js';

const formSiswa = document.getElementById('form-tambah-siswa');
const tbodySiswa = document.getElementById('tbody-siswa');

// 1. FUNGSI TAMBAH DATA (CREATE)
formSiswa.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ambil nilai dari form
    const nama = document.getElementById('nama_siswa').value;
    const kelas = document.getElementById('kelas_siswa').value;
    const usia = document.getElementById('usia_siswa').value;
    const bb = document.getElementById('bb_siswa').value;
    const tb = document.getElementById('tb_siswa').value;
    const foto = document.getElementById('foto_siswa').value || 'https://via.placeholder.com/150?text=No+Foto';

    try {
        // Buat key acak unik untuk siswa baru di node "students"
        const newStudentRef = push(ref(db, 'students'));

        await set(newStudentRef, {
            nama_lengkap: nama,
            kelas: kelas,
            usia: parseInt(usia),
            bb: parseInt(bb),
            tb: parseInt(tb),
            status: 'aktif',
            foto: foto
        });

        alert('Data siswa berhasil ditambahkan!');
        formSiswa.reset(); // Kosongkan form
    } catch (error) {
        console.error("Error menambah data:", error);
        alert('Gagal menyimpan data.');
    }
});

// 2. FUNGSI MENAMPILKAN DATA (READ - REALTIME)
const studentsRef = ref(db, 'students');
// onValue akan membaca data pertama kali, dan otomatis memperbarui tabel jika ada data yang berubah di Firebase
onValue(studentsRef, (snapshot) => {
    tbodySiswa.innerHTML = ''; // Bersihkan tabel sebelum merender ulang

    if (snapshot.exists()) {
        const data = snapshot.val();

        // Looping untuk setiap anak (siswa) di dalam node "students"
        for (const key in data) {
            const siswa = data[key];
            const badgeClass = siswa.status === 'aktif' ? 'badge-aktif' : 'badge-vakum';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${siswa.foto}" alt="Foto"></td>
                <td><strong>${siswa.nama_lengkap}</strong></td>
                <td>${siswa.kelas}</td>
                <td>${siswa.usia} Thn</td>
                <td>${siswa.bb} kg / ${siswa.tb} cm</td>
                <td><span class="${badgeClass}">${siswa.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn-sm btn-warning" onclick="window.ubahStatus('${key}', '${siswa.status}')">Ubah Status</button>
                    <button class="btn-sm btn-danger" onclick="window.hapusSiswa('${key}', '${siswa.nama_lengkap}')">Hapus</button>
                </td>
            `;
            tbodySiswa.appendChild(tr);
        }
    } else {
        // Jika database kosong
        tbodySiswa.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Belum ada data siswa.</td></tr>';
    }
});

// 3. FUNGSI UBAH STATUS (UPDATE) & HAPUS (DELETE)
// Karena file ini bertipe module, fungsinya harus dikaitkan ke object window agar bisa dipanggil HTML (onclick)
window.ubahStatus = async (idSiswa, statusSaatIni) => {
    const statusBaru = statusSaatIni === 'aktif' ? 'vakum' : 'aktif';
    if (confirm(`Ubah status siswa ini menjadi ${statusBaru.toUpperCase()}?`)) {
        const studentRef = ref(db, `students/${idSiswa}`);
        await update(studentRef, { status: statusBaru });
    }
};

window.hapusSiswa = async (idSiswa, namaSiswa) => {
    if (confirm(`Yakin ingin menghapus data ${namaSiswa} secara permanen? Data absensi yang berkaitan mungkin akan kehilangan referensi nama.`)) {
        const studentRef = ref(db, `students/${idSiswa}`);
        await remove(studentRef);
    }
};