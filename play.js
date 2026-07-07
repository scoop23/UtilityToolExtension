document.querySelector(".automate-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
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
        '.ad-stickyhero',
        '.ad--hero',
        '.ad-container',
        'div[id^="google_ads_iframe"]',
        'iframe[name*="google_ads_iframe"]',
        '.ad__slot',
        '.ad',
        '.ad__slot--rail',
        '.leaderboardAdWrapper'].join(', ');

      // 2. Fallback: Target it by its main descriptive class names just in case
      document.querySelectorAll(adSelectors).forEach(el => el.remove());
    }
  });

});


// (async () => {
//   const browser = await chromium.launch();
// })
