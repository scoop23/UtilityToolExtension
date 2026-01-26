import { sizesContainer, inputText, outputText, copyText } from "./popup.js";

// size is an object.
export function addSize(size) {
  // if small size button is click like 350x50?
  // it will append the size to the string simply.
  let rawOutputText = '';
  if (outputText.value) {
    rawOutputText = outputText.value;
  }

  const storedHTML = localStorage.getItem("myImage") || null;
  const parser = new DOMParser();
  const doc = storedHTML ? parser.parseFromString(storedHTML, "text/html") : parser.parseFromString(rawOutputText, "text/html");

  let img = doc.querySelector("img");

  if (img) {
    img.removeAttribute('width: "100%"');
    img.style.width = `${size.width}px`;
    img.style.height = `${size.height}px`;
    copyText(doc.body.innerHTML);
    outputText.value = doc.body.innerHTML;

    const imgHTML = img.outerHTML;
    localStorage.setItem("myImage", imgHTML);
  } else {
    console.error("No <img> tag found.");
  }

  // console.log(local, size);
}

const sizes = [
  { name: "320x50", sizeWidth: 320, sizeHeight: 70 },
  { name: "300x600", sizeWidth: 300, sizeHeight: 600 },
  { name: "160x600", sizeWidth: 160, sizeHeight: 600 },
  { name: "728x90", sizeWidth: 728, sizeHeight: 90 },
  { name: "970x250", sizeWidth: 970, sizeHeight: 250 },
  { name: "300x250", sizeWidth: 300, sizeHeight: 250 }
];

// Generate buttons
let accumulatedHTML = '';
if (sizesContainer) {
  console.log(sizes.length);
  sizes.forEach(e => {
    let html = `<button class="${e.name}-size-btn size-btns" data-size-height="${e.sizeHeight}" data-size-width="${e.sizeWidth}">${e.name}</button>`;
    accumulatedHTML += html;
  });
}
sizesContainer.innerHTML = accumulatedHTML;

// Convert array could also used [...sizesContainer.children]
Array.from(sizesContainer.children).forEach(element => {
  element.addEventListener("click", () => {
    const height = element.dataset.sizeHeight;
    const width = element.dataset.sizeWidth;
    addSize({ width, height });
  });
});
