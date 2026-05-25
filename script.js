/* =========================
   ELEMENTS
========================= */
const inputText = document.getElementById("inputText");
const chatBox = document.getElementById("chatBox");
const loading = document.getElementById("loading");
const wordCount = document.getElementById("wordCount");
const modeSelect = document.getElementById("modeSelect");

/* =========================
   WORD COUNTER
========================= */
inputText.addEventListener("input", () => {
  const words = inputText.value.trim().split(/\s+/);
  wordCount.innerText = inputText.value ? words.length + " kata" : "0 kata";
});

/* =========================
   MAIN FUNCTION
========================= */
async function paraphraseText() {
   alert("tombol jalan");

  const input =
    document.getElementById("inputText").value;

  const resultBox =
    document.getElementById("result");

  const mode =
    document.getElementById("modeSelect").value;

  if (!input.trim()) {

    resultBox.innerHTML =
      "Masukkan teks dulu.";

    return;
  }

  resultBox.innerHTML =
    "AI sedang berpikir...";

  try {

    // =========================
    // MODE SYSTEM PROMPT
    // =========================
    let systemPrompt = "";

    if (mode === "formal") {

      systemPrompt =
        "Ubah teks menjadi formal, sopan, dan profesional.";

    }

    else if (mode === "casual") {

      systemPrompt =
        "Ubah teks menjadi santai seperti percakapan sehari-hari.";

    }

    else if (mode === "simple") {

      systemPrompt =
        "Ubah teks menjadi lebih sederhana dan mudah dipahami.";

    }

    else if (mode === "humanizer") {

      systemPrompt = `
Kamu adalah AI Humanizer.

Tugas:
- Ubah teks agar terdengar seperti manusia asli
- Hilangkan kesan AI/robot
- Buat natural, mengalir, tidak kaku
- Tetap pertahankan makna asli
`;

    }

    else {

      systemPrompt =
        "Ubah teks menjadi profesional, natural, dan rapi.";

    }

    // =========================
    // FETCH WORKER API
    // =========================
    const res = await fetch(
      "https://weathered-snow-3837.yahyaagus204.workers.dev",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          input,
          systemPrompt
        })

      }
    );

    const data = await res.json();

    console.log(data);

    // =========================
    // RESULT
    // =========================
    const result =
      data?.choices?.[0]?.message?.content ||
      "AI tidak mengembalikan hasil.";

    resultBox.innerHTML = result;

  }

  catch (err) {

    console.log(err);

    resultBox.innerHTML =
      "Terjadi error: " + err.message;

  }

}

    /* =========================
       ERROR HANDLING AMAN
    ========================= */
    if (data.error) {
      addMessage("ai", "Error API: " + data.error.message);
      loading.classList.add("hidden");
      return;
    }

    const result = data?.choices?.[0]?.message?.content;

    if (result) {
      addMessage("ai", result);
    } else {
      addMessage("ai", "AI tidak mengembalikan hasil");
    }

  } catch (err) {
    console.log(err);
    addMessage("ai", "Terjadi error koneksi");
  }

  loading.classList.add("hidden");
}

/* =========================
   CHAT BUBBLE SYSTEM
========================= */
function addMessage(type, text) {

  const msg = document.createElement("div");
  msg.className = type === "user" ? "msg-user" : "msg-ai";

  const content = document.createElement("div");
  content.innerText = text;

  msg.appendChild(content);

  /* =========================
     COPY BUTTON (ONLY AI)
  ========================= */
  if (type === "ai") {

    const copyBtn = document.createElement("button");
    copyBtn.innerText = "📋 Copy";
    copyBtn.className = "copy-btn";

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(text);
      copyBtn.innerText = "✔ Copied";

      setTimeout(() => {
        copyBtn.innerText = "📋 Copy";
      }, 1500);
    };

    msg.appendChild(copyBtn);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   DARK MODE FIX (NAVBAR BUTTON)
========================= */
function toggleTheme() {

  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");

  const btn = document.querySelector(".dark-toggle");

  if (btn) {
    btn.innerText = isLight ? "☀️" : "🌙";
  }

  console.log("Theme:", isLight ? "LIGHT" : "DARK");
}

/* =========================
   COPY CHAT (OPTIONAL)
========================= */
function copyChat() {
  navigator.clipboard.writeText(chatBox.innerText);
  alert("Chat berhasil dicopy");
}
