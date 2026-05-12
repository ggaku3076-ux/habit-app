# Prompt Edit: Smooth Button Transition & Interaction Animation

Tolong tambahkan transisi dan animasi yang smooth untuk semua tombol/interaksi di Habit App.

Konteks project:
- File utama: `index.html`, `style.css`, `script.js`
- Project sudah punya fitur habit, daily schedule, progress, bottom sheet, edit mode, tambah/hapus item.
- Jangan ubah layout besar-besaran.
- Fokus hanya pada feel interaksi ketika user menekan tombol atau melakukan action.

Target animasi:
1. Semua tombol terasa responsif, smooth, dan ringan di HP.
2. Saat tombol ditekan, ada efek scale kecil / press feedback.
3. Saat checkbox habit/todo dicentang, animasi check muncul halus.
4. Saat item habit/todo ditambah, card masuk dengan animasi slide/fade kecil.
5. Saat item dihapus, card keluar dengan animasi fade/scale sebelum di-remove.
6. Saat mode edit aktif, tombol delete muncul smooth.
7. Bottom sheet muncul dan hilang lebih smooth.
8. Progress percent/bar tetap smooth dan tidak lag.

Arahan visual:
- Animasi harus clean, soft, modern, dan cocok untuk mobile habit tracker.
- Durasi ideal 120ms–350ms.
- Gunakan `transform` dan `opacity` sebanyak mungkin supaya performa bagus.
- Hindari animasi berat seperti blur besar, box-shadow berlebihan, atau layout shifting.
- Tambahkan `will-change` hanya pada elemen yang benar-benar dianimasikan.
- Tetap support `prefers-reduced-motion: reduce`.

Yang perlu diedit:
- `style.css`:
  - transition button umum
  - active/pressed state
  - animasi `.check.checked svg`
  - animasi `.habit-card.is-new` dan todo baru
  - animasi delete button di edit mode
  - animasi bottom sheet
- `script.js`:
  - jika perlu, tambahkan class sebelum remove card agar animasi hapus sempat jalan
  - jangan pakai alert/prompt browser
  - jangan bikin animasi yang bikin lag di HP

Output yang diinginkan:
- Semua tombol terasa halus saat ditekan.
- Check/uncheck habit dan todo terasa hidup.
- Add/delete habit dan daily schedule punya transisi smooth.
- Kode tetap rapi, sederhana, dan performa mobile aman.
