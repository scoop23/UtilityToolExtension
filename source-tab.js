// Keep tools pointed at the tab that opened the detached utility window.
export async function getSourceTab() {
  const tabId = new URLSearchParams(window.location.search).get("tabid");
  if (tabId !== null && /^\d+$/.test(tabId)) {
    return chrome.tabs.get(Number(tabId));
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No source tab found.");
  return tab;
}
