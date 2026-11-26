import { getSourceTab } from "./source-tab.js";

const ws = new WebSocket("ws://localhost:8888");


document.querySelector(".automate-btn").addEventListener("click", async () => {
  let status = document.getElementById("automate-status");
  if (!status) {
    status = document.createElement("p");
    status.id = "automate-status";
    status.setAttribute("role", "status");
    document.querySelector(".automate-btn").after(status);
  }
  status.textContent = "";
  try {
  const tab = await getSourceTab();

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log("Removing the sticky hero ad wrapper...");

      // 1. Target the element using its unique data-testid attribute
      const stickyAd = document.querySelector('[data-testid="sticky-hero-ad"]');
      if (stickyAd) {
        stickyAd.remove();
      }

      const adSelectors = [
        '[data-testid="sticky-hero-ad"]',
        '[data-testid="ad-container"]',
        '[data-testid="ad-label"]',
        '[aria-label="advertisement"]',
        '.ad-stickyhero',
        '.ad--hero',
        '.ad-container',
        'div[id^="google_ads_iframe"]',
        'iframe[name*="google_ads_iframe"]',
        '.ad__slot',
        '.ad',
        '.ad__slot--rail',
        '.leaderboardAdWrapper',
        'ad-container'].join(', ');


      document.querySelectorAll(adSelectors).forEach((iframe) => {
        console.log(iframe);
      });
      // 2. Fallback: Target it by its main descriptive class names just in case
      document.querySelectorAll(adSelectors).forEach(el => el.remove());

    }
  });
  status.textContent = "Ad cleanup completed.";
  } catch (error) {
    status.textContent = /ExtensionsSettings|policy/i.test(error.message)
      ? "Chrome policy blocks this extension from modifying this page. Check ExtensionSettings at chrome://policy or contact your browser administrator."
      : `Could not modify this page: ${error.message}`;
  }
});


// (async () => {
//   const browser = await chromium.launch();
// })
