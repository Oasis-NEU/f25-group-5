console.log("Popup loaded");

const scanGmailBtn = document.getElementById("scanGmailBtn");

if (scanGmailBtn) {
  scanGmailBtn.addEventListener("click", () => {
    scanGmailBtn.textContent = "🔍 Scanning Gmail...";
    scanGmailBtn.disabled = true;

    // Send message to service worker
    chrome.runtime.sendMessage({ action: "laizi-scanGmail" }, (response) => {
      console.log("Response from service worker:", response);

      if (!response) {
        scanGmailBtn.textContent = "❌ No Response";
        console.error("No response from service worker");
        resetButton();
        return;
      }

      // Handle different result types
      switch (response.action) {
        case "success":
          scanGmailBtn.textContent = "✅ Scan Complete";
          console.log("Scan Results:", response.result);
          break;

        case "missing-auth":
          scanGmailBtn.textContent = "⚠️ Missing Auth";
          console.error("No token found in chrome.storage.local");
          break;

        case "general-error":
          scanGmailBtn.textContent = "❌ Server Error";
          console.error("Server returned an error:", response.error);
          break;

        case "request-error":
          scanGmailBtn.textContent = "❌ Request Failed";
          console.error("Network or fetch error:", response.error);
          break;

        default:
          scanGmailBtn.textContent = "❌ Unknown Error";
          console.error("Unexpected response:", response);
          break;
      }

      // Reset the button after a few seconds
      resetButton();
    });
  });
}

function resetButton() {
  setTimeout(() => {
    scanGmailBtn.textContent = "📧 Scan Gmail";
    scanGmailBtn.disabled = false;
  }, 2500);
}
