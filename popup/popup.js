console.log("Popup loaded");

const scanGmailBtn = document.getElementById("scanGmailBtn");
const sendMessageBtn = document.getElementById("sendBtn");
const messageBox = document.getElementById("userInput");

let canSendMessages = true;

const resetButton = () => {
    scanGmailBtn.textContent = "📧 Scan Gmail";
    scanGmailBtn.disabled = false;
};

const addMessage = (text, sender) => {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
};

const chatbotMessage = () => {
    const text = userInput.value.trim();
    if (!text || !canSendMessages) return;

    sendMessageBtn.disabled = true;
    canSendMessages = false;
    addMessage(text, "user");
    userInput.value = "";

    chrome.runtime.sendMessage({ action: "laizi-chatbot", data: text }, (response) => {
        if (response.action != "success") {
            addMessage("Error occured. Could not send message.", "bot");
            sendMessageBtn.disabled = false;
            canSendMessages  = true;
            return;
        }

        addMessage(response.message, "bot");

        sendMessageBtn.disabled = false;
        canSendMessages  = true;
    })
};

const addNewEvents = (newEvents) => {
    chrome.runtime.sendMessage(
        { action: "laizi-addEvent", data: { events: newEvents } },
        (response) => {
            console.log(response.action);
            switch (response.action) {
                case "success":
                case "empty-set":
                    scanGmailBtn.textContent = "✅ Submitted";
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

            setTimeout(resetButton, 2000);
        }
    );
};

const handleNewEvents = (newEvents) => {
    // TODO: Handle new events
    newEvents.forEach((e) => {
        alert(e.name);
    });

    // simulate adding new events
    addNewEvents(newEvents);
};

const filterEvents = (data) => {
    chrome.runtime.sendMessage(
        { action: "laizi-filterEvents", data: data },
        (response) => {
            // Handle errors/success
            let successCase = false;

            switch (response.action) {
                case "success":
                    if (response.result.length != 0) {
                        successCase = true;
                        scanGmailBtn.textContent = "🔍 Select Events";

                        handleNewEvents(response.result);
                        break;
                    }

                case "empty-set":
                    scanGmailBtn.textContent = "✅ Nothing New Found";
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

            if (!successCase) {
                setTimeout(resetButton, 2000);
            }
        }
    );
};

const scanGmail = () => {
    scanGmailBtn.textContent = "🔍 Scanning Gmail...";
    scanGmailBtn.disabled = true;

    // Send message to service worker
    chrome.runtime.sendMessage({ action: "laizi-scanGmail" }, (response) => {
        console.log("Response from service worker:", response);
        let noButtonReset = false;

        if (!response) {
            scanGmailBtn.textContent = "❌ No Response";
            console.error("No response from service worker");
            resetButton();
            return;
        }

        // Handle different result types
        switch (response.action) {
            case "success":
                scanGmailBtn.textContent = "🗓️ Checking Availability...";
                console.log("Scan Results:", response.result);

                // Filter and get new events
                noButtonReset = true;
                filterEvents(response.result);

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

        if (noButtonReset) return;

        setTimeout(resetButton, 2000);
    });
};

if (scanGmailBtn) {
    scanGmailBtn.addEventListener("click", scanGmail);
}

sendMessageBtn.addEventListener("click", chatbotMessage);
messageBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") chatbotMessage();
});
