console.log("tis das a popup");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  // Fake bot reply (for demo)
  setTimeout(() => {
    addMessage("Got it! (This is a placeholder response.)", "bot");
  }, 600);
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
const scanGmailBtn = document.getElementById("scanGmailBtn");

if (scanGmailBtn) {
  scanGmailBtn.addEventListener("click", () => {
    scanGmailBtn.textContent = "🔍 Scanning Gmail...";
    scanGmailBtn.disabled = true;

    // Simulate 2-second "scan"
    setTimeout(() => {
      scanGmailBtn.textContent = "✅ Scan Complete";
      console.log("Fake Gmail scan results:", [
        { from: "support@example.com", subject: "Welcome to LAIZI!" },
        { from: "news@updates.com", subject: "Your weekly summary" },
        { from: "noreply@google.com", subject: "Security alert" }
      ]);

      // Reset button after a few seconds
      setTimeout(() => {
        scanGmailBtn.textContent = "📧 Scan Gmail";
        scanGmailBtn.disabled = false;
      }, 2500);
    }, 2000);
  });
}

