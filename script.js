/* =========================
   ELEMENTS
========================= */
const inputText = document.getElementById("inputText");
const chatBox = document.getElementById("chatBox");
const loading = document.getElementById("loading");
const wordCount = document.getElementById("wordCount");

/* =========================
   WORD COUNTER
========================= */
inputText.addEventListener("input", () => {
  const words = inputText.value.trim().split(/\s+/);
  wordCount.innerText =
    inputText.value.trim() ? words.length + " kata" : "0 kata";
});

/* =========================
   MAIN FUNCTION
========================= */
async function paraphraseText() {

  const input = inputText.value;
  const mode = document.getElementById("modeSelect").value;

  if (!input.trim()) {
    alert("Masukkan teks dulu");
    return;
  }

  // user message
  addMessage("user", input);

  loading.classList.remove("hidden");

  try {

    /* =========================
       SYSTEM PROMPT
    ========================= */
    let systemPrompt = "";

    if (mode === "formal") {
      systemPrompt = "Ubah teks menjadi formal, sopan, dan profesional.";
    }
    else if (mode === "casual") {
      systemPrompt = "Ubah teks menjadi santai seperti percakapan sehari-hari.";
    }
    else if (mode === "simple") {
      systemPrompt = "Ubah teks menjadi lebih sederhana dan mudah dipahami.";
    }
    else if (mode === "humanizer") {
      systemPrompt = `
Kamu adalah AI Humanizer.
- Ubah teks agar terdengar seperti manusia asli
- Hilangkan kesan AI/robot
- Natural, mengalir, tidak kaku
- Tetap pertahankan makna asli
`;
    }
    else {
      systemPrompt = "Ubah teks menjadi profesional, natural, dan rapi.";
    }

    /* =========================
       FETCH WORKER
    ========================= */
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

    loading.classList.add("hidden");

    console.log(data);

    /* =========================
       ERROR CHECK
    ========================= */
    if (data?.error) {
      addMessage("ai", "Error API: " + data.error);
      return;
    }

    const result =
      data?.choices?.[0]?.message?.content ||
      "AI tidak mengembalikan hasil.";

    addMessage("ai", result);

  }

  catch (err) {
    console.log(err);
    loading.classList.add("hidden");
    addMessage("ai", "Terjadi error koneksi");
  }
}

/* =========================
   CHAT SYSTEM (BUBBLE)
========================= */
function addMessage(type, text) {

  const msg = document.createElement("div");
  msg.className = type === "user" ? "msg-user" : "msg-ai";

  const content = document.createElement("div");
  content.innerText = text;

  msg.appendChild(content);

  // COPY BUTTON (AI ONLY)
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
   DARK MODE
========================= */
function toggleTheme() {
  document.body.classList.toggle("light");

  const btn = document.querySelector(".dark-toggle");

  if (btn) {
    btn.innerText =
      document.body.classList.contains("light")
        ? "☀️"
        : "🌙";
  }
}

/* =========================
   OPTIONAL COPY ALL CHAT
========================= */
function copyChat() {
  navigator.clipboard.writeText(chatBox.innerText);
  alert("Chat berhasil dicopy");
}
