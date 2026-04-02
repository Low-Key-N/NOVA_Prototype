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

function respond(text) {
  let reply = "";

  // SIMPLE “AI” for now
  if (text.toLowerCase().includes("hello")) {
    reply = "Hello. I'm Nova. How can I assist you today?";
  } else if (text.toLowerCase().includes("time")) {
    reply = "The current time is " + new Date().toLocaleTimeString();
  } else {
    reply = "I heard you say " + text;
  }

  speak(reply);
}

function speak(message) {
  const speech = new SpeechSynthesisUtterance(message);

  // Slightly “Teto-inspired” tuning
  speech.pitch = 1.3;
  speech.rate = 1.1;

  speech.onstart = () => {
    statusText.textContent = "Status: Speaking...";
  };

  speech.onend = () => {
    statusText.textContent = "Status: Idle";
  };

  window.speechSynthesis.speak(speech);
}