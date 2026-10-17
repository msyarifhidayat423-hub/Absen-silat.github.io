// dokumentasi.js
import { db, ref, push, set, onValue, remove } from './firebase-config.js';

const formDokumentasi = document.getElementById('form-dokumentasi');
const inputTanggalDok = document.getElementById('tanggal_dokumentasi');
const inputUrlFoto = document.getElementById('url_foto_dokumentasi');

const filterTanggalDok = document.getElementById('filter_tanggal_dok');
const galeriContainer = document.getElementById('galeri-container');

// 1. FUNGSI SIMPAN DOKUMENTASI (CREATE)
formDokumentasi.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tanggal = inputTanggalDok.value;
    const urlFoto = inputUrlFoto.value;

    try {
        // Arahkan ke node dokumentasi berdasarkan tanggal yang dipilih
        const docRef = ref(db, `dokumentasi/${tanggal}`);
        // Buat key acak baru di dalam tanggal tersebut
        const newPhotoRef = push(docRef);

        // Simpan URL foto
        await set(newPhotoRef, urlFoto);

        alert('Foto dokumentasi berhasil disimpan!');

        // Kosongkan form input URL, tapi biarkan tanggalnya
        inputUrlFoto.value = '';

        // Otomatis ubah filter galeri ke tanggal yang baru saja diinput agar langsung terlihat
        filterTanggalDok.value = tanggal;
        tampilkanGaleri(tanggal);

    } catch (error) {
        console.error("Error menyimpan dokumentasi:", error);
        alert('Gagal menyimpan foto dokumentasi.');
    }
});

// 2. FUNGSI MENAMPILKAN GALERI BERDASARKAN TANGGAL (READ)
filterTanggalDok.addEventListener('change', (e) => {
    const tanggalDipilih = e.target.value;
    tampilkanGaleri(tanggalDipilih);
});

// Fungsi terpisah untuk memuat galeri agar bisa dipanggil ulang otomatis setelah upload
let galeriListener = null; // Menyimpan referensi listener agar tidak dobel

function tampilkanGaleri(tanggal) {
    if (!tanggal) {
        galeriContainer.innerHTML = '<p style="color: #64748b;">Pilih tanggal untuk melihat dokumentasi.</p>';
        return;
    }

    galeriContainer.innerHTML = '<p style="color: #64748b;">Memuat galeri...</p>';

    const docRef = ref(db, `dokumentasi/${tanggal}`);

    // onValue agar galeri otomatis update jika ada foto baru atau foto dihapus
    onValue(docRef, (snapshot) => {
        galeriContainer.innerHTML = ''; // Bersihkan kontainer

        if (snapshot.exists()) {
            const dataPhotos = snapshot.val();

            for (const key in dataPhotos) {
                const urlFoto = dataPhotos[key];

                // Membuat elemen card untuk setiap foto
                const imgCard = document.createElement('div');
                imgCard.style.position = 'relative';
                imgCard.style.width = '200px';
                imgCard.style.height = '200px';
                imgCard.style.borderRadius = '8px';
                imgCard.style.overflow = 'hidden';
                imgCard.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

                imgCard.innerHTML = `
                    <img src="${urlFoto}" alt="Dokumentasi ${tanggal}" style="width: 100%; height: 100%; object-fit: cover;">
                    <button 
                        onclick="window.hapusFoto('${tanggal}', '${key}')"
                        style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px; font-weight: bold;"
                    >X</button>
                `;

                galeriContainer.appendChild(imgCard);
            }
        } else {
            galeriContainer.innerHTML = `<p style="color: #ef4444;">Tidak ada foto dokumentasi pada tanggal ${tanggal}.</p>`;
        }
    });
}

// 3. FUNGSI MENGHAPUS FOTO (DELETE)
window.hapusFoto = async (tanggal, idFoto) => {
    if (confirm("Yakin ingin menghapus foto ini dari galeri?")) {
        try {
            const photoRef = ref(db, `dokumentasi/${tanggal}/${idFoto}`);
            await remove(photoRef);
        } catch (error) {
            console.error("Gagal menghapus foto:", error);
            alert('Gagal menghapus foto.');
        }
    }
};