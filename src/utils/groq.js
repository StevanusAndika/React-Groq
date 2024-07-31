// Mengimpor modul yang diperlukan dari groq-sdk
import { Groq } from "groq-sdk";
import { Completions } from "groq-sdk/resources/completions.mjs";

// Mendapatkan kunci API dari variabel lingkungan
const Groq_API = import.meta.env.VITE_GROQ;

// Menginisialisasi instance Groq dengan kunci API dan opsi untuk penggunaan browser
const groq = new Groq({
  apiKey: Groq_API,
  dangerouslyAllowBrowser: true, // Opsi ini harus digunakan dengan hati-hati untuk keamanan
});

// Fungsi untuk mengirim permintaan ke API dan mendapatkan respons
export const requestTo = async (content) => {
  try {
    // Mengirim permintaan untuk membuat kompilasi dengan pesan dari pengguna
    const reply = await groq.chat.completions.create({
      messages: [{
        role: "user", // Menandakan bahwa pesan berasal dari pengguna
        content, // Konten pesan yang dikirim oleh pengguna
      }],
      model: "llama3-8b-8192" // Model yang digunakan untuk menghasilkan respons
    });
    
    // Mengembalikan konten dari respons yang diterima sebagai teks biasa
    // Pastikan bahwa reply.choices[0].message.content adalah teks biasa
    return reply.choices[0].message.content;
  } catch (error) {
    // Menangani kesalahan jika terjadi selama permintaan
    console.error("Error fetching response:", error);
    throw error; // Menghentikan eksekusi dan melempar kesalahan
  }
};
