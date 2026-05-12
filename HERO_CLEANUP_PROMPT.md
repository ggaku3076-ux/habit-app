# Prompt Edit: Rapihin Hero Habit App Setelah Gambar Daun Dihapus

Tolong rapihin tampilan hero section pada project Habit App setelah gambar daun/plant dihapus.

Konteks project:
- File utama: `index.html`, `style.css`, `script.js`
- Gambar plant sebelumnya sudah dihapus dari HTML dan CSS.
- Jangan mengembalikan gambar daun/plant.
- Pertahankan konsep mobile app preview ukuran sekitar 390x844.
- Style harus tetap soft, clean, modern, organic, dan cocok untuk habit tracker.

Tujuan desain:
1. Area kanan hero yang dulu ditempati gambar daun jangan terlihat kosong.
2. Susunan teks “today’s habits”, subtitle, chip streak/level, dan progress card harus lebih seimbang.
3. Hero tetap terasa premium walau tanpa ilustrasi plant.
4. Tambahkan dekorasi CSS ringan saja, misalnya blob, circle, glow, pattern kecil, atau abstract shapes — tanpa memakai image asset.
5. Jaga readability dan spacing.

Arahan visual:
- Warna utama tetap hijau sage / forest green dan cream.
- Gunakan pseudo-element CSS (`::before`, `::after`) atau dekorasi div jika perlu.
- Dekorasi boleh berupa lingkaran blur, organic blob, garis halus, atau floating cards kecil.
- Jangan terlalu ramai.
- Progress card tetap di bagian bawah hero, tapi posisinya boleh disesuaikan agar komposisi rapi.

Yang perlu diedit:
- `style.css` terutama bagian `.hero`, `.hero::before`, `.hero::after`, `.hero-copy`, `.hero-chips`, `.progress-card`.
- Jika perlu, boleh tambah elemen kecil di `index.html`, tapi jangan tambah gambar daun/plant.
- `script.js` tidak perlu animasi plant lagi.

Output yang diinginkan:
- Tampilan hero bersih dan balance tanpa gambar daun.
- Tidak ada referensi `.plant`, `plant-final.png`, atau `animateHeroPlant()`.
- Kode tetap sederhana dan mudah dibaca.
