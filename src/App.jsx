import React, { useState, useEffect } from 'react';
import './App.css';
import { requestTo } from "./utils/groq";
import { Light as SyntaxHighlight } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Membuat instance SweetAlert2 dengan dukungan React
const MySwal = withReactContent(Swal);

function App() {
  // State untuk menyimpan data dari bot dan input pengguna
  const [data, setData] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Hook useEffect untuk menjalankan kode saat komponen pertama kali dimuat
  useEffect(() => {
    // Ambil data yang disimpan di localStorage dengan kunci 'chatData'
    const savedData = localStorage.getItem('chatData');
    if (savedData) {
      setData(savedData); // Set data jika ditemukan
    }
    // Kosongkan nilai input
    setInputValue("");
  }, []); // Dependency array kosong berarti effect ini hanya dijalankan sekali saat mount

  // Fungsi untuk menangani pengiriman form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman saat form disubmit

    // Menampilkan modal SweetAlert2 dengan loading indicator
    MySwal.fire({
      title: 'Loading...',
      html: 'Sedang memproses permintaan anda...',
      text: 'Mohon bersabar....',
      didOpen: () => {
        MySwal.showLoading(); // Menampilkan animasi loading
      }
    });

    // Delay untuk simulasi proses yang memakan waktu
    setTimeout(async () => {
      try {
        const content = inputValue; // Ambil nilai input dari state
        const bot = await requestTo(content); // Mengirim request dan mendapatkan response dari bot
        setData(bot); // Set data dari bot ke state
        localStorage.setItem('chatData', bot); // Simpan data ke localStorage

        // Kosongkan inputValue setelah pengiriman
        setInputValue("");

        MySwal.close(); // Menutup modal SweetAlert2
      } catch (error) {
        // Menampilkan error jika terjadi masalah
        MySwal.fire('Error', 'Terjadi kesalahan!', 'error');
      }
    }, 2000); // Delay selama 2 detik
  };

  // Fungsi untuk menangani perubahan pada input
  const handleChange = (e) => {
    setInputValue(e.target.value); // Update nilai input di state
  };

  // Fungsi untuk menyalin teks hasil ke clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(data); // Salin data ke clipboard
    MySwal.fire('Berhasil', 'Text berhasil dicopy', 'success'); // Tampilkan notifikasi sukses
  };

  // Fungsi untuk menyalin kode hasil ke clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(data); // Salin data ke clipboard
    MySwal.fire('Berhasil', 'Kode berhasil dicopy', 'success'); // Tampilkan notifikasi sukses
  };

  return (
    <main className='max-w-xl w-full mx-auto'>
      <h1>Steven Bot</h1>
      {/* Form untuk input dan pengiriman */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder='Ketik permintaan Anda'
          id="content"
          value={inputValue}
          onChange={handleChange} // Memanggil handleChange saat input berubah
        />
        <button type="submit">Kirim</button>
      </form>
      {/* Menampilkan hasil jika ada */}
      <div>
        {data && (
          <div className='result'>
            {/* Menampilkan hasil dengan syntax highlighting jika data adalah kode */}
            {data.startsWith('') ? (
              <div>
                <SyntaxHighlight language="swift" style={dracula} wrapLongLines={true}>
                  {data}
                </SyntaxHighlight>
                <button onClick={handleCopyCode}>Salin kode</button>
              </div>
            ) : (
              <div>
                <pre>{data}</pre>
                <button onClick={handleCopyText}>Salin teks</button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
