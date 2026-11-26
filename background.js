// true: separate window; false: Chrome's default toolbar popup.

// Reload the extension after changing this value.
const USE_POPUP_WINDOW = false;

chrome.action.setPopup({
  popup: USE_POPUP_WINDOW ? "" : "hello.html?mode=toolbar"
}).catch((error) => console.error("Could not configure Utility Tool:", error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log("📨 RECEIVED:", message);
  console.log(message.action);

  if (message.action === "captureDesktop") {
    captureDesktopScreenshot(
      message.width,
      message.height,
      message.deviceScaleFactor,
      message.tabId
    ).then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        console.error("Capture Failed:", error);
        sendResponse({
          success: false,
          error: error.message,
        });
      });
    return true;
  }
});

async function captureDesktopScreenshot(
  width = 1920,
  height = 1080,
  deviceScaleFactor = 1,
  sourceTabId
) {

  const [tab] = sourceTabId != null
    ? [await chrome.tabs.get(sourceTabId)]
    : await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

  if (!tab?.id) {
    throw new Error("No active tab found.");
  }

  const tabId = tab.id;

  const debuggee = {
    tabId
  };

  let attached = false;

  try {

    // --------------------------------
    // 1. Attach debugger
    // --------------------------------

    await chrome.debugger.attach(
      debuggee,
      "1.3"
    );

    attached = true;


    // --------------------------------
    // 2. Enable Page domain
    // --------------------------------

    await chrome.debugger.sendCommand(
      debuggee,
      "Page.enable"
    );


    // --------------------------------
    // 3. Set viewport
    // --------------------------------

    await chrome.debugger.sendCommand(
      debuggee,
      "Emulation.setDeviceMetricsOverride",
      {
        width: width,
        height: height,

        deviceScaleFactor: deviceScaleFactor,

        mobile: true
      }
    );


    // Give Chrome a moment to re-layout
    await sleep(100);


    // --------------------------------
    // 4. Capture screenshot
    // --------------------------------

    const result = await chrome.debugger.sendCommand(
      debuggee,
      "Page.captureScreenshot",
      {
        format: "png",

        fromSurface: true,

        captureBeyondViewport: false
      }
    );


    if (!result?.data) {
      throw new Error("Chrome did not return screenshot data.");
    }


    // --------------------------------
    // 5. Convert Base64 → data URL
    // --------------------------------

    const dataUrl =
      `data:image/png;base64,${result.data}`;


    // --------------------------------
    // 6. Download
    // --------------------------------

    const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");


    await chrome.downloads.download({
      url: dataUrl,

      filename:
      `screenshot-${width}x${height}-${timestamp}.png`,

      saveAs: true
    });

  } finally {

    // --------------------------------
    // 7. Restore normal viewport
    // --------------------------------

    if (attached) {

      try {

        await chrome.debugger.sendCommand(
          debuggee,
          "Emulation.clearDeviceMetricsOverride"
        );

      } catch (error) {

        console.warn(
          "Could not clear device metrics:",
          error
        );
      }


      // --------------------------------
      // 8. Detach debugger
      // --------------------------------

      try {

        await chrome.debugger.detach(
          debuggee
        );

      } catch (error) {

        console.warn(
          "Could not detach debugger:",
          error
        );
      }
    }
  }
}


function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

chrome.action.onClicked.addListener((tab) => {
  if (!USE_POPUP_WINDOW) return;

  const params = new URLSearchParams({
    tabid: String(tab.id),
    url: tab.url || ""
  });

  chrome.windows.create({
    url: chrome.runtime.getURL(`hello.html?${params}`),
    type: "popup",
    width: 720,
    height: 650
  }).catch((error) => console.error("Could not open Utility Tool:", error));
});
