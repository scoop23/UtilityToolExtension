console.log('This is a popup!');
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

function handleGenerateImage(customAttrString) {
  const html = createImageHTML(customAttrString);
  copyText(html.htmlString);
  outputText.value = html.htmlString
  console.log(html);

  localStorage.setItem("myImage", html.htmlString);
  localStorage.setItem("srcString", html.src);
}

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





