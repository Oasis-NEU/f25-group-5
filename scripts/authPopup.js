// Starts OAuth2 process for Google

chrome.runtime.onMessageExternal.addListener(
    (message, sender, sendResponse) => {
        console.log(message);
        if (message.type === "LAIZI_OAUTH_SUCCESS") {
            console.log("Got token:", message.token);
            // do whatever you need
            sendResponse({ ok: true });
        }
    }
);

(async () => {
    const authInProg = await chrome.storage.local.get("laiziAuthInProgress");
    const tokenLoaded = await chrome.storage.local.get("laiziAuthToken");
    if (authInProg.laiziAuthInProgress || tokenLoaded.laiziAuthToken) {
        console.log("Auth in progress, skipping...");
        return;
    }

    await chrome.storage.local.set({ laiziAuthInProgress: true });

    const redirectUrl = encodeURIComponent(
        chrome.runtime.getURL("popup/redirect.html")
    );
    console.log(redirectUrl);
    const authUrl = `https://liazi-backend.vercel.app/api/v1/google-oauth/init-auth?redirectUri=${redirectUrl}`;

    chrome.windows.create(
        {
            url: authUrl,
            type: "popup",
            width: 500,
            height: 700,
        },
        (win) => {
            const tabId = win.tabs[0].id;

            const listener = async (tabIdUpdated, changeInfo, tab) => {
                if (tabIdUpdated === tabId && changeInfo.url) {
                    if (
                        changeInfo.url.startsWith(
                            chrome.runtime.getURL("popup/redirect.html")
                        ) || true
                    ) {
                        const url = new URL(changeInfo.url);
                        const authToken = url.searchParams.get("authToken");

                        if (authToken) {
                            await chrome.storage.local.set({ laiziAuthToken: authToken });
                            await chrome.storage.local.set({ laiziAuthInProgress: false });

                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.windows.remove(win.id);
                        }
                    }
                }
            };

            chrome.tabs.onUpdated.addListener(listener);
        }
    );
})();
