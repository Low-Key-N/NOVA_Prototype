const button = document.getElementById("start");
const statusText = document.getElementById("status");

let recognition;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
} else {
  alert("Speech Recognition not supported in this browser");
}

recognition.continuous = false;
recognition.lang = "en-US";

button.onclick = () => {
  statusText.textContent = "Status: Listening...";
  recognition.start();
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log("You said:", transcript);

  statusText.textContent = "Status: Thinking...";

  respond(transcript);
};

async function respond(text) {
  statusText.textContent = "Status: Thinking...";

  const res = await fetch("http://localhost:3000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: text }),
  });

  const data = await res.json();
  speak(data.reply);
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);

  const voices = speechSynthesis.getVoices();

  let selectedVoice =
    voices.find(v => v.name.includes("Microsoft Aria")) ||
    voices.find(v => v.name.includes("Microsoft Zira")) ||
    voices.find(v => v.name.includes("Google US English")) ||
    voices.find(v => v.lang === "en-US");

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.pitch = 1.1;   
  utterance.rate = 0.95;  
  utterance.volume = 1;

  utterance.onstart = () => {
    statusText.textContent = "Status: Speaking...";
  };

  utterance.onend = () => {
    statusText.textContent = "Status: Idle";
  };

  speechSynthesis.speak(utterance);
}