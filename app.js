let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
const textContainer = $("#text");

const maxWordLength = 5;
let words = [];
let currentIndex = 0;
let currentLine = 0;
let lines = [];

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

const getLines = () => {
  const chars = [...$$("#text span")];
  const groups = groupBy(chars, (el) => el.offsetTop);
  return [...groups.entries()];
};

const updateLines = () => {
  const prevLines = lines.slice(0, currentLine + 1);
  const length = prevLines.map((el) => el[1].length).reduce((a, b) => a + b, 0);
  if (currentIndex == length) {
    prevLines[currentLine][1].forEach((span) => {
      span.hidden = true;
    });
    currentLine += 1;
  }
};

const showText = () => {
  range(1000).forEach((_) => {
    const chars = [...words.random()];
    chars.forEach((char) => {
      appendEl(textContainer, char);
    });
  });
  currentEl().classList.add("current");
  lines = getLines();
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
    currentEl().classList.add("current");
    updateLines();
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

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
