// Menunggu sampai seluruh halaman dimuat
document.addEventListener('DOMContentLoaded', () => {

    // 1. Logika untuk memindahkan Tab Menu
    const navButtons = document.querySelectorAll('.nav-btn:not(.logout-btn)');
    const contentSections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus class active dari semua tombol
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Tambahkan class active ke tombol yang diklik
            button.classList.add('active');

            // Sembunyikan semua halaman (section)
            contentSections.forEach(section => {
                section.style.display = 'none';
            });

            // Tampilkan halaman yang sesuai dengan atribut data-target
            const targetId = button.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';
        });
    });

    // 2. Logika untuk Logout
    const btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', () => {
        const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
        if (confirmLogout) {
            // Hapus sesi login
            sessionStorage.removeItem('isLoggedIn');
            // Arahkan kembali ke halaman login
            window.location.replace('index.html');
        }
    });

});