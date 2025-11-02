# 💌 Hadiah Ulang Tahun Digital

Ini adalah proyek *website* statis kecil-kecilan yang aku buat sebagai hadiah ulang tahun spesial.

Idenya adalah membuat sebuah "pengalaman" interaktif, bukan cuma halaman web biasa. Pengguna akan diajak membuka kado virtual yang isinya adalah serangkaian kejutan, mulai dari kupon-kupon lucu, surat personal, sampai galeri kenangan.

## ✨ Fitur-Fitur Keren

Proyek ini mungkin kelihatan simpel, tapi ada beberapa hal seru di dalamnya:

* **Alur Cerita (SPA-like):** Web ini dibuat kayak *Single Page Application* (SPA) palsu. Tiap bagian (kado, kupon, galeri) akan muncul satu per satu, jadi ada alur ceritanya.
* **Animasi Latar Ganda:**
    * **Bintang Jatuh:** Bagian kado pembuka punya latar bintang jatuh yang dibuat pakai CSS murni.
    * **Hujan Hati:** Setelah kado dibuka, latarnya ganti jadi animasi "hujan hati" yang dibuat pakai `CreateJS (EaselJS)`.
* **Kupon Interaktif:** Kupon-kuponnya bisa diklik dan akan memunculkan modal (pop-up) yang isinya GIF lucu.
* **Galeri Foto "Konstelasi":**
    * Di **Desktop**, galeri foto ditampilkan secara acak pakai `position: absolute` kayak konstelasi bintang.
    * Di **Mobile**, *layout*-nya otomatis berubah jadi satu kolom (`flex-direction: column`) biar gampang di-*scroll*.
* **Musik Latar:** Ada *backsound* musik yang otomatis main pas kado dibuka untuk nambahin suasana.
* **Optimasi:** Gambar-gambar di galeri udah pakai *lazy loading* biar halaman kebuka lebih cepat.

## 💻 Teknologi yang Dipakai

Nggak ada yang aneh-aneh, kok. Ini 100% *vanilla* (polosan):

* **HTML5:** Untuk struktur halamannya.
* **CSS3:** Untuk semua *styling*, animasi (termasuk bintang jatuh & SVG *drawing*), dan *responsive design* (pakai Grid & Flexbox).
* **JavaScript (ES6+):** Untuk semua logika: memanipulasi DOM (ganti-ganti halaman), *event listener* (biar bisa diklik), dan ngatur modal.

### ...dan Bantuan dari Beberapa *Library* Keren:

* **[CreateJS (EaselJS)](https://createjs.com/easeljs):** Ini yang dipakai buat *ngurusin* animasi hujan hati di `<canvas>`.
* **[canvas-confetti](https://github.com/catdad/canvas-confetti):** Dipakai buat nembakin *confetti* pas kotak kado pertama kali dibuka.

## 🚀 Cara Menjalankan

Karena ini *static site*, gampang banget:

1.  *Clone* atau *download* repositori ini.
2.  Buka file `index.html` di browser kamu.
3.  **Sangat disarankan:** Pakai *plugin* **Live Server** di VS Code. Kenapa? Biar fitur *autoplay* audionya bisa jalan (banyak browser nge-blok *autoplay* kalau filenya dibuka langsung dari lokal).
