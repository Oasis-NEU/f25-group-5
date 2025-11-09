chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !message.action) return;

    if (message.action === "laizi-scanGmail") {
        console.log("Scanning Gmail...");
        (async () => {
            try {
                const { laiziAuthToken } = await chrome.storage.local.get(
                    "laiziAuthToken"
                );

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
                console.log(result);

                if (response.status != 200) {
                    sendResponse({
                        action: "general-error",
                        error: result.message || "Unknown",
                    });
                    return;
                }

                sendResponse({ action: "success", result });
            } catch (err) {
                console.error("Scan error:", err);
                sendResponse({ action: "request-error", error: err.message });
            }
        })();

        return true;
    }

    if (message.action == "laizi-filterEvents") {
        console.log("Filtering events...");
        (async () => {
            if (
                !message.data ||
                !message.data.events ||
                message.data.events.length == 0
            ) {
                sendResponse({
                    action: "empty-set",
                });
                return;
            }

            // remove events that are chronologically in the past
            const futureEvents = message.data.events.filter(
                (e) => Date.parse(e.date) >= Date.now()
            );

            // also, rid events that the user has already signed up for, check for conflicts
            const { laiziAuthToken } = await chrome.storage.local.get(
                "laiziAuthToken"
            );

            if (!laiziAuthToken) {
                sendResponse({ action: "missing-auth" });
                return;
            }

            const requestOptions = {
                method: "POST",
                body: JSON.stringify({ events: futureEvents }),
                headers: {
                    Authorization: `Bearer ${laiziAuthToken}`,
                    "Content-Type": "application/json",
                },
                redirect: "follow",
            };

            try {
                const response = await fetch(
                    "https://liazi-backend.vercel.app/api/v1/calendar/check-conflicts",
                    requestOptions
                );

                const result = await response.json();

                if (response.status != 200) {
                    sendResponse({
                        action: "general-error",
                        error: result.message || "Unknown",
                    });
                    return;
                }

                sendResponse({ action: "success", result: result.result });
            } catch (error) {
                console.error("Availability error:", error);
                sendResponse({ action: "request-error", error: error.message });
            }
        })();

        return true;
    }

    if (message.action == "laizi-addEvent") {
        console.log("Adding events...");
        (async () => {
            if (
                !message.data ||
                !message.data.events ||
                message.data.events.length == 0
            ) {
                sendResponse({
                    action: "empty-set",
                });
                return;
            }

            // also, rid events that the user has already signed up for, check for conflicts
            const { laiziAuthToken } = await chrome.storage.local.get(
                "laiziAuthToken"
            );

            if (!laiziAuthToken) {
                sendResponse({ action: "missing-auth" });
                return;
            };

            const requestOptions = {
                method: "POST",
                body: JSON.stringify({ events: message.data.events }),
                headers: {
                    Authorization: `Bearer ${laiziAuthToken}`,
                    "Content-Type": "application/json",
                },
                redirect: "follow",
            };

            try {
                const response = await fetch(
                    "https://liazi-backend.vercel.app/api/v1/calendar/add-event",
                    requestOptions
                );

                const result = await response.json();

                if (response.status != 200) {
                    sendResponse({
                        action: "general-error",
                        error: result.message || "Unknown",
                    });
                    return;
                }

                sendResponse({ action: "success", result: result.result });
            } catch (error) {
                console.error("Availability error:", err);
                sendResponse({ action: "request-error", error: err.message });
            }
        })();

        return true;
    }
});
