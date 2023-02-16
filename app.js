let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
const textContainer = $("#text");

const maxWordLength = 5;
const timeLimit = 10;

let words = [];
let currentIndex = 0;
let currentLine = 0;
let lines = [];
let running = false;
let currentTime = 0;
let correctCount = 0;
let falseCount = 0;

const appendEl = (parentElement, text) => {
  const newEl = document.createElement("span");
  newEl.innerHTML = text;
  parentElement.appendChild(newEl);
};

const fetchWords = async () => {
  const response = await fetch("words.txt");
  const text = await response.text();
  words = text.split("\n").filter((word) => word.length <= maxWordLength);
};

const updateTime = () => {
  currentTime -= 1;
  $("#countdown").innerHTML = currentTime;
  if (currentTime == 0) {
    running = false;
    let correctWords = [...$$("#text span")]
      .slice(0, currentIndex)
      .filter((el) => !isLetter(el.innerHTML)).length;
    console.log(correctWords);
    let wordCount = (correctWords * 60) / timeLimit;
    $(
      "#result"
    ).innerHTML = `WPM: ${wordCount}, Correct: ${correctCount}, False: ${falseCount}`;
  } else {
    window.setTimeout(updateTime, 1000);
  }
};

const startCountdown = () => {
  correctCount = 0;
  falseCount = 0;
  running = true;
  $("#result").innerHTML = "";
  currentTime = timeLimit;
  window.setTimeout(updateTime, 1000);
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
  if (running == false) startCountdown();
  let current = currentEl();
  if (
    event.key.toLowerCase() == current.innerHTML ||
    (event.key === " " && !isLetter(current.innerHTML))
  ) {
    correctCount += 1;
    current.classList.add("correct");
    current.classList.remove("current");
    currentIndex += 1;
    currentEl().classList.add("current");
    updateLines();
  } else {
    falseCount += 1;
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

const range = (size) => {
  return [...Array(size).keys()];
};
