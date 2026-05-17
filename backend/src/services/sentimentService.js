const axios = require("axios");
const logger = require("../utils/logger");

class SentimentService {
  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
    this.modelName = process.env.OLLAMA_MODEL || "llama3";
  }

  /**
   * Menghapus data sensitif (PII) sederhana menggunakan regex
   * demi privasi sebelum dikirim ke LLM lokal.
   */
  stripSensitiveData(text) {
    if (!text) return "";
    
    let sanitized = text;
    // Hapus nomor telepon (format sederhana)
    sanitized = sanitized.replace(/\+?\d{10,13}/g, "[PHONE]");
    // Hapus pola email
    sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]");
    // Hapus angka berurutan panjang (kemungkinan ID atau No Rekening)
    sanitized = sanitized.replace(/\d{15,}/g, "[ID]");
    
    return sanitized;
  }

  /**
   * Menganalisis teks jurnal menggunakan Ollama lokal
   */
  async analyzeJournal(text) {
    const fallback = { sentiment: "Neutral", risk_score: 0 };
    
    try {
      const sanitizedText = this.stripSensitiveData(text);
      
      const systemPrompt = `You are a mental health assistant. Analyze the following journal entry for sentiment and risk of self-harm or severe distress.
Return ONLY a valid JSON object with the following structure:
{
  "sentiment": "Anxiety" | "Depression" | "Positive" | "Neutral",
  "risk_score": number (1-10)
}
Guidelines:
- "risk_score" should be high (8-10) only if there are clear signs of self-harm intent or severe crisis.
- Be objective and helpful.`;

      const response = await axios.post(this.ollamaUrl, {
        model: this.modelName,
        prompt: `System: ${systemPrompt}\n\nUser Journal: ${sanitizedText}`,
        stream: false,
        format: "json"
      }, {
        timeout: 30000 // 30 detik timeout agar tidak gantung
      });

      if (response.data && response.data.response) {
        try {
          const result = JSON.parse(response.data.response);
          return {
            sentiment: result.sentiment || "Neutral",
            risk_score: parseInt(result.risk_score) || 0
          };
        } catch (parseError) {
          logger.error("Gagal parsing JSON dari Ollama:", parseError.message);
          return fallback;
        }
      }
      
      return fallback;
    } catch (error) {
      logger.error("Ollama Local Error (Mungkin server mati atau model belum di-pull):", error.message);
      // Jangan throw error agar request user tidak gagal total
      return fallback;
    }
  }

  /**
   * Menganalisis tren mood mingguan/bulanan
   */
  async analyzeMoodTrends(moodSummary) {
    // Fallback dinamis berdasarkan rata-rata mood user
    const avg = moodSummary?.averageMood || 0;
    let fallback;
    if (avg >= 4) {
      fallback = "Mood-mu sedang dalam kondisi yang baik! Pertahankan kebiasaan positif yang sudah kamu jalani dan teruslah merawat dirimu.";
    } else if (avg >= 3) {
      fallback = "Mood-mu terlihat stabil belakangan ini. Coba perhatikan momen-momen kecil yang membuatmu merasa lebih ringan dan perbanyak hal tersebut.";
    } else if (avg >= 2) {
      fallback = "Sepertinya ada beberapa hari yang terasa berat. Ingat, merawat diri bukan kemewahan — itu kebutuhan. Satu langkah kecil sudah cukup untuk hari ini.";
    } else {
      fallback = "Konsistensi mencatat perasaanmu adalah langkah berani. Teruskan, dan beri dirimu ruang untuk tumbuh perlahan.";
    }

    try {
      const systemPrompt = `Kamu adalah wellness coach yang penuh empati dan berbicara seperti teman dekat.
Analisis data mood pengguna berikut dan berikan insight singkat dalam Bahasa Indonesia yang terasa personal dan relevan.
SEBUTKAN data spesifik (seperti rata-rata mood, mood yang paling sering muncul, atau faktor yang berpengaruh) dalam responsmu agar terasa nyata — bukan pesan generik.
Hindari diagnosis medis. Fokus pada pola yang terlihat dan satu saran konkret yang bisa dicoba.
Maksimal 2-3 kalimat. Jangan mulai dengan salam atau sapaan.`;

      const userPrompt = `Data Mood Pengguna:
- Rata-rata mood: ${moodSummary.averageMood?.toFixed(2)} dari skala 1-5
- Total catatan: ${moodSummary.totalEntries} entri
- Mood yang paling sering: ${moodSummary.mostFrequentMood}
- Faktor teratas yang memengaruhi mood: ${moodSummary.topFactors?.join(", ") || "belum ada"}

Berikan insight personal dalam Bahasa Indonesia:`;

      const response = await axios.post(this.ollamaUrl, {
        model: this.modelName,
        prompt: `System: ${systemPrompt}\n\n${userPrompt}`,
        stream: false,
      }, {
        timeout: 45000 
      });

      return response.data?.response?.trim() || fallback;
    } catch (error) {
      logger.error("AI Insight Error:", error.message);
      return fallback;
    }
  }
}

module.exports = new SentimentService();
