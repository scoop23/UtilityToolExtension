console.log('This is a popup!');
// import html2canvas from 'html2canvas';

//
// class CopyClass {
//   constructor(attrString) {
//     this.attrString = attrString;
//   }
//
//   srcAttrs(attrParams) {
//
//     return ``
//   }
// }

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    console.log("Copied to clipboard");
  } catch (err) {
    console.error("failed to copy :" + text);
  }
}

function createImageHTML(customAttrString) { // dry principle. thought of this a while back, but didn't know how to execute it efficiently.
  const src = inputText.value || localStorage.getItem("srcString");
  inputText.value = src;
  return { src: src, htmlString: `<img src="${src}" style="display:block; margin-left:auto; margin-right: auto; margin-top: 15px; margin-bottom: 15px; ${customAttrString || ''}">` };
}

export const inputText = document.getElementById("input-text")

inputText.addEventListener("input", () => {
  const storedRawImg = localStorage.getItem("srcString");
  // will remove, testing case in the past.
  const parser = new DOMParser();
  const newDoc = parser.parseFromString(storedRawImg, "text/html");
  console.log(newDoc);

  localStorage.setItem("srcString", outputText.value);
})

const borderRedNoWidth = document.getElementById("border-red-no-width");
const copyBtn = document.getElementById("copy-btn");
export const outputText = document.getElementById("output-text");
const borderRedBtn = document.getElementById("border-red-btn");
const noWidth = document.getElementById("no-width");
export const sizesContainer = document.querySelector(".sizes-container");
const screenshotBtn = document.querySelector(".screenshot-btn-desktop");
const screenshotBtnIphoneX = document.querySelector(".screenshot-btn-iphonex");
const screenshotBtnIphone6 = document.querySelector(".screenshot-btn-iphone6plus");
const screenshotBtnIphone14 = document.querySelector(".screenshot-btn-iphone14");
const screenshotBtnGalaxyS10 = document.querySelector(".screenshot-btn-galaxys10");
const screenshotBtnIpad = document.querySelector(".screenshot-btn-ipad");

function handleGenerateImage(customAttrString) {
  const html = createImageHTML(customAttrString);
  copyText(html.htmlString);
  outputText.value = html.htmlString
  console.log(html);

  localStorage.setItem("myImage", html.htmlString);
  localStorage.setItem("srcString", html.src);
}

async function captureViewport() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const dataUrl = await chrome.tabs.captureVisibleTab(
    tab.windowId,
    {
      format: "png",
    }
  );
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "screenshot.png";
  link.click();
}

const dimensionTypes = {
  "desktop": { width: 1920, height: 1080 },
  "iphoneX": { width: 1125, height: 2436 },
  "iphone6plus": { width: 1242, height: 2208 },
  "iphone14": { width: 1290, height: 2796 },
  "galaxys10": { width: 1442, height: 3041 },
  "ipad": { width: 1536, height: 2048 },
};

async function captureViewportMobile(type) {

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
    format: "png",
  });

  const img = new Image();
  const mwidth = dimensionTypes[type]?.width || 375;
  const mheight = dimensionTypes[type]?.height || 812;

  img.onload = () => {
    const canvas = document.createElement("canvas");

    canvas.width = mwidth;
    canvas.height = mheight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      0,
      0,
      mwidth, // dw
      mheight,// dh
    );

    const resizedImage = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = resizedImage;
    link.download = `screenshot-${mwidth}x${mheight}.png`;
    link.click();
  };

  img.src = dataUrl;
}

// screenshotBtn.addEventListener("click", () => {
//   captureViewportMobile("desktop");
// });

screenshotBtn.addEventListener("click", captureViewport);

screenshotBtnIphoneX.addEventListener("click", () => {
  captureViewportMobile("iphoneX");
});

screenshotBtnIphone6.addEventListener("click", () => {
  captureViewportMobile("iphone6plus");
});

screenshotBtnIphone14.addEventListener("click", () => {
  captureViewportMobile("iphone14");
});

screenshotBtnGalaxyS10.addEventListener("click", () => {
  captureViewportMobile("galaxys10");
});

screenshotBtnIpad.addEventListener("click", () => {
  captureViewportMobile("ipad");
});




// default copy
copyBtn.addEventListener("click", () => {
  handleGenerateImage("width : 100%; padding-top: 10px; padding-bottom: 10px")
})

// with border red
borderRedBtn.addEventListener("click", () => {
  handleGenerateImage("width : 100%; border: 3px solid red;")
})

borderRedNoWidth.addEventListener("click", () => {
  handleGenerateImage("border: 3px solid red;")
});

// no width 100% and borde red
noWidth.addEventListener("click", () => {
  handleGenerateImage("padding-top: 10px; padding-bottom: 10px;");
})





