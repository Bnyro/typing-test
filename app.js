let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
const textContainer = $("#text");

const maxWordLength = 5;
let words = [];
let currentIndex = 0;

const appendEl = (parentElement, text) => {
  const newEl = document.createElement("span");
  newEl.innerHTML = text;
  parentElement.appendChild(newEl);
};

const range = (size) => {
  return [...Array(size).keys()];
};

const fetchWords = async () => {
  const response = await fetch("words.txt");
  const text = await response.text();
  words = text.split("\n").filter((word) => word.length <= maxWordLength);
};

const showText = () => {
  range(50).forEach((_) => {
    const chars = [...words.random()];
    chars.forEach((char) => {
      appendEl(textContainer, char);
    });
  });
  currentEl().classList.add("current");
};

fetchWords().then(() => {
  showText();
});

document.addEventListener("keypress", (event) => {
  let current = currentEl();
  if (
    event.key.toLowerCase() == current.innerHTML ||
    (event.key === " " && !isLetter(current.innerHTML))
  ) {
    current.classList.add("correct");
    current.classList.remove("current");
    currentIndex += 1;
  }
});

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

function isLetter(char) {
  return /[a-zA-Z]/.test(char);
}

function currentEl() {
  return $$("#text span")[currentIndex];
}
