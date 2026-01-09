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

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    console.log("Copied to clipboard");
  } catch (err) {
    console.error("failed to copy :" + text);
  }
}



const inputText = document.getElementById("input-text")

inputText.addEventListener("input", () => {
  localStorage.setItem("srcString", inputText.value);
})

const copyBtn = document.getElementById("copy-btn");
const outputText = document.getElementById("output-text");
const borderRedBtn = document.getElementById("border-red-btn");
const noWidth = document.getElementById("no-width");

function createImageHTML(customAttrString) {
  const src = inputText.value || localStorage.getItem("srcString");
  inputText.value = src;
  return `<img src="${src}" style="display:block; margin-left:auto; margin-right: auto; padding-top : 10px; padding-bottom: 10px; margin-top: 10px; margin-bottom: 10px; ${customAttrString || ''}">`;
}

// default copy
copyBtn.addEventListener("click", () => {
  const html = createImageHTML("width : 100%;");
  copyText(html);
  outputText.value = html;
})

// with border red
borderRedBtn.addEventListener("click", () => {
  const html = createImageHTML("width : 100%; border: 3px solid red;")
  copyText(html);
  outputText.value = html;
})

// no width 100% and borde red
noWidth.addEventListener("click", () => {
  const html = createImageHTML();
  copyText(html)
  outputText.value = html;
})





