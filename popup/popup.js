console.log("Popup loaded");

const scanGmailBtn = document.getElementById("scanGmailBtn");
const sendMessageBtn = document.getElementById("sendBtn");
const messageBox = document.getElementById("userInput");

let canSendMessages = true;
let usersEventDecisions = [];
let expectedEventCount = 0;
let expectedEvents = [];

const delEventsAndPost = () => {
    const scanStatusList = document.getElementById("scanStatusList");
    scanStatusList.innerHTML = ""; // Clear all children

    scanGmailBtn.textContent = "⏩ Adding Events";

    const result = expectedEvents.filter((_, index) => {
        return usersEventDecisions[index];
    });

    if (result.length > 0) {
        addNewEvents(result);
    } else {
        resetButton();
    }
}

const verifyArrayIsFull = (arr, len) => {
    if (arr.length < len) {
        return false;
    }

    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr)) {
            return false;
        }
    }

    return true;
}

const addEventWidget = ({header, lines, index}) => {
    const list = document.getElementById("scanStatusList");
    if (!list) return;

    const box = document.createElement("div");
    box.className = "status-box";
    box.id = "box" + index

    // Header
    const h = document.createElement("div");
    h.className = "status-header";
    h.textContent = header;
    box.appendChild(h);

    // Lines
    const statusList = document.createElement("div");
    statusList.className = "status-list";
    for (let i = 0; i < lines.length; ++i) {
        const line = document.createElement("div");
        line.className = "status-text";
        line.textContent = lines[i] || "";
        statusList.appendChild(line);
    }
    box.appendChild(statusList);

    // Actions
    const actions = document.createElement("div");
    actions.className = "status-actions";
    const acceptBtn = document.createElement("button");
    acceptBtn.className = "action-btn accept";
    acceptBtn.textContent = "✓ Accept";
    acceptBtn.title = "Accept";
    acceptBtn.setAttribute("aria-label", "Accept");
    // Add click handler for accept button
    acceptBtn.addEventListener("click", () => {
        usersEventDecisions[index] = true; // true = accepted
        box.remove(); // Remove the widget
        console.log("User decisions:", usersEventDecisions);

        if (verifyArrayIsFull(usersEventDecisions, expectedEventCount)) {
            delEventsAndPost();
        }
    });
    actions.appendChild(acceptBtn);

    const declineBtn = document.createElement("button");
    declineBtn.className = "action-btn decline";
    declineBtn.textContent = "✕ Decline";
    declineBtn.title = "Decline";
    declineBtn.setAttribute("aria-label", "Decline");
    // Add click handler for decline button
    declineBtn.addEventListener("click", () => {
        usersEventDecisions[index] = false; // false = declined
        box.remove(); // Remove the widget
        console.log("User decisions:", usersEventDecisions);

        if (verifyArrayIsFull(usersEventDecisions, expectedEventCount)) {
            delEventsAndPost();
        }
    });
    actions.appendChild(declineBtn);

    box.appendChild(actions);
    list.appendChild(box);
};

const promptEventWidgets = (eventDetails => {
    expectedEvents = eventDetails;
    expectedEventCount = eventDetails.length;

    for (let i = 0; i < eventDetails.length; i++) {
        const { name, desc, place, date, conflict } = eventDetails[i];
        const lines = [
            conflict ? `**CONFLICT: '${conflict}'**` : null,
            `Date: ${date}`,
            `Place: ${place}`,
            desc
        ].filter(Boolean)

        addEventWidget({header: name, lines: lines, index: i});
    }
})

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

                        promptEventWidgets(response.result);
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
    if (e.key === "Enter")
        {
            chatbotMessage();
            // test to see if addEvent widget works
            //addEventWidget({header: "Steast bereckfast ",list:["food food and yet more I want some food ", "some time", "steast"], index: 0 })
            //addEventWidget({header: "Steast lunch ",list:["food food and yet more I want some food ", "some time", "steast"], index: 1 })
            //addEventWidget({header: "Steast dinner ",list:["food food and yet more I want some food ", "some time", "steast"], index: 2 })
        }


});