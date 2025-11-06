// Starts OAuth2 process for Google

const API_ORIGIN = "https://liazi-backend.vercel.app";

const completeAuthFlow = async () => {
    await chrome.storage.local.set({ laiziAuthInProgress: true });

    const redirectUrl = encodeURIComponent(
        chrome.runtime.getURL("popup/redirect.html")
    );
    const authUrl = `${API_ORIGIN}/api/v1/google-oauth/init-auth?redirectUri=${redirectUrl}`;

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
                        ) ||
                        true
                    ) {
                        const url = new URL(changeInfo.url);
                        const authToken = url.searchParams.get("authToken");

                        if (authToken) {
                            await chrome.storage.local.set({
                                laiziAuthToken: authToken,
                            });
                            await chrome.storage.local.set({
                                laiziAuthInProgress: false,
                            });

                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.windows.remove(win.id);
                        }
                    }
                }
            };

            chrome.tabs.onUpdated.addListener(listener);
        }
    );
};

const queueAuthFlow = async () => {
    const authInProg = await chrome.storage.local.get("laiziAuthInProgress");
    const tokenLoaded = await chrome.storage.local.get("laiziAuthToken");
    if (authInProg.laiziAuthInProgress) {
        console.log("Auth in progress, skipping...");
        return;
    }

    // Check to see if we even need a new token.
    if (tokenLoaded.laiziAuthToken) {
        const headers = new Headers();
        const reqOptions = {};
        headers.append("Authorization", `Bearer ${tokenLoaded.laiziAuthToken}`);

        reqOptions["method"] = "POST";
        reqOptions["headers"] = headers;
        reqOptions["redirect"] = "follow";

        fetch(`${API_ORIGIN}/api/v1/google-oauth/verify-token`, reqOptions)
            .then((response) => response.json())
            .then((value) => {
                if (!value.success) {
                    completeAuthFlow();
                }
            })
            .catch((reason) => {
                console.error("Could not verify token. Error.");
                console.error(reason);
            });
    } else {
        completeAuthFlow();
    }
}

chrome.tabs.onActivated.addListener(tabInfo => {
    chrome.tabs.get(tabInfo.tabId, tab => {
        if (new URL(tab.url).hostname == "mail.google.com") {
            queueAuthFlow();
        }
    })
})