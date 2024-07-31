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
  const [data, setData] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Cek apakah alert sudah ditampilkan sebelumnya
    const isAlertShown = localStorage.getItem('isAlertShown');
    
    if (!isAlertShown) {
      // Tampilkan alert
      MySwal.fire({
        
        title: 'Hai, selamat datang di projek aplikasi saya!',
        icon: 'info',
        text: 'Untuk melihat portofolio saya yang lainnya, silahkan kunjungi halaman https://github.com/StevanusAndika',
       
        timer:4000,
        
     
        

        didOpen: () => {
          MySwal.isLoading(); // Menampilkan animasi loading jika diperlukan
        }
      }).finally(() => {
        // Simpan status bahwa alert sudah ditampilkan
        localStorage.setItem('isAlertShown', 'true');
      });
    }

    const savedData = localStorage.getItem('chatData');
    if (savedData) {
      setData(savedData);
    }
    setInputValue("");
  }, []); // Dependency array kosong berarti effect ini hanya dijalankan sekali saat mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    MySwal.fire({
      title: 'Loading...',
      text: 'Mohon bersabar....',
      html: 'Sedang memproses permintaan anda...',
      didOpen: () => {
        MySwal.showLoading();
      }
    });

    setTimeout(async () => {
      try {
        const content = inputValue;
        const bot = await requestTo(content);
        setData(bot);
        localStorage.setItem('chatData', bot);
        setInputValue("");
        MySwal.close();
      } catch (error) {
        MySwal.fire('Error', 'Terjadi kesalahan!', 'error');
      }
    }, 2000);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(data);
    MySwal.fire('Berhasil', 'Text berhasil dicopy', 'success');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data);
    MySwal.fire('Berhasil', 'Kode berhasil dicopy', 'success');
  };

  return (
    <main className='max-w-xl w-full mx-auto'>
      <h1>Steven Bot</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder='Ketik permintaan Anda'
          id="content"
          value={inputValue}
          onChange={handleChange}
        />
        <button type="submit">Kirim</button>
      </form>
      <div>
        {data && (
          <div className='result'>
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
