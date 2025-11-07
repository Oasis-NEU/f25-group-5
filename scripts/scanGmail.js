chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.action) return;

  if (message.action === "laizi-scanGmail") {
    (async () => {
      try {
        const { laiziAuthToken } = await chrome.storage.local.get("laiziAuthToken");

        if (!laiziAuthToken) {
          sendResponse({ action: "missing-auth" });
          return;
        }

        const requestOptions = {
          method: "PATCH",
          headers: { Authorization: `Bearer ${laiziAuthToken}` },
          redirect: "follow",
        };

        const response = await fetch(
          "https://liazi-backend.vercel.app/api/v1/gmail/scan-email",
          requestOptions
        );

        const result = await response.json();

        if (response.status != 200) {
          sendResponse({ action: "general-error", error: result.message || "Unknown" });
          return;
        }

        sendResponse({ action: "success", result });
      } catch (err) {
        console.error("Scan error:", err);
        sendResponse({ action: "request-error", error: err.message });
      }
    })();

    // Keep message channel open until the async IIFE completes
    return true;
  }
});
