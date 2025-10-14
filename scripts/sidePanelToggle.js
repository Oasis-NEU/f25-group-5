const GOOGLE_ORIGIN = 'https://mail.google.com';

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'popup/popup.html',
      enabled: true
    });
});

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ tabId: tab.id });
});