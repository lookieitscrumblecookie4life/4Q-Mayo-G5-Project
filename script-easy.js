const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const statsContainer = document.querySelector(".stats-container");
const easyBg = document.getElementById("easybg");
const scoreDisplay = document.getElementById("high-score-display-easy");

let cards;
let interval;
let firstCard = null;
let secondCard = null;
let gameWon = false;
let canClick = true;
let clickCooldown = false;
let movesCount = 0;
let winCount = 0;

let highScore = localStorage.getItem("easyHighScore") 
  ? parseInt(localStorage.getItem("easyHighScore")) 
  : null;

let seconds = 60;
let minutes = 0;

const items = [
  { name: "jar1", image: "images/easylevel/jar1.png" },
  { name: "jar2", image: "images/easylevel/jar2.png" },
  { name: "jar3", image: "images/easylevel/jar3.png" },
  { name: "jar4", image: "images/easylevel/jar4.png" },
  { name: "jar5", image: "images/easylevel/jar5.png" },
  { name: "jar6", image: "images/easylevel/jar6.png" },
  { name: "jar7", image: "images/easylevel/jar7.png" },
  { name: "jar8", image: "images/easylevel/jar8.png" }
];

const initializePage = () => {
  if (stopButton) stopButton.classList.add("hide");
  if (statsContainer) statsContainer.classList.add("hide");
  if (easyBg) easyBg.classList.add("hide");
  if (controls) controls.classList.remove("hide");
  if (startButton) startButton.classList.remove("hide");
  if (result) result.innerHTML = "";
  if (timeValue) timeValue.innerHTML = `<span>Time:</span>01:00`;
  if (moves) moves.innerHTML = `<span>Moves:</span> 0`;
  resetGameState();

  if (scoreDisplay) {
    if (highScore !== null) {
      scoreDisplay.classList.remove("hide");
      scoreDisplay.innerHTML = `<span>"Your highest score is... </span> ${highScore} moves! That's some sweet and sticky success, pal!"`;
    } else {
      scoreDisplay.classList.remove("hide");
      scoreDisplay.innerHTML = `<span>"You haven't stacked any jars yet—but the pantry's waiting, champ!"</span>`;
    }
  }
};

window.onload = initializePage;

const resetGameState = () => {
  clearInterval(interval);
  firstCard = null;
  secondCard = null;
  gameWon = false;
  canClick = true;
  clickCooldown = false;
  movesCount = 0;
  winCount = 0;
  seconds = 60;
  minutes = 0;
};

const timeGenerator = () => {
  if (gameWon) return;
  seconds -= 1;
  if (seconds < 0 && minutes > 0) {
    minutes -= 1;
    seconds = 59;
  }
  if (seconds < 0 && minutes <= 0) {
    clearInterval(interval);
    if (timeValue) timeValue.innerHTML = `<span>Time:</span>00:00`;
    if (!gameWon) showTimeUpMessage();
    return;
  }
  const secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  const minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  if (timeValue) timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

const showTimeUpMessage = () => {
  const timeUpMessage = document.createElement("div");
  timeUpMessage.id = "game-message";
  timeUpMessage.innerHTML = `
    <div class="message-content">
      <img class="easyguypage2" src="images/sticker-easyguy-uncropped.png">
      <h2>Aww, time's up! But that's okay—every great baker needs a little practice! Wanna roll up your sleeves and give it another go? I believe in ya, cookie champ!</h2>
      <a href="page-levels.html" id="go-back"><img class="button-goback" src="images/button-goback.png"></a>
      <a href="page-score-easy.html" id="hi-score"><img class="button-hiscore" src="images/button-hiscore.png"></a>
    </div>
  `;

  document.body.appendChild(timeUpMessage);
  document.body.style.overflow = 'hidden';
  document.getElementById("go-back").addEventListener("click", stopGame);
};

const showWinMessage = () => {
  gameWon = true;
  clearInterval(interval);
  if (highScore === null || movesCount < highScore) {
    highScore = movesCount;
    localStorage.setItem("easyHighScore", highScore);
  }

  const winMessage = document.createElement("div");
  winMessage.id = "game-message";
  winMessage.innerHTML = `
    <div class="message-content">
      <img class="easyguypage2" src="images/sticker-easyguy-uncropped.png">
      <h2>Wheee! You did it! All the jars are matched in just ${movesCount} moves, and I'm doing a happy little dance! Wanna play again and spread more jammy joy?</h2>
      <a href="page-levels.html" id="go-back"><img class="button-goback" src="images/button-goback.png"></a>
      <a href="page-score-easy.html" id="hi-score"><img class="button-hiscore" src="images/button-hiscore.png"></a>
    </div>
  `;

  document.body.appendChild(winMessage);
  document.body.style.overflow = 'hidden';
  document.getElementById("go-back").addEventListener("click", stopGame);
};

const movesCounter = () => {
  movesCount += 1;
  if (moves) moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

const generateRandomCards = () => {
  const tempArray = [...items];
  const cardValues = [];
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const createGameBoard = (cardValues) => {
  gameContainer.innerHTML = "";
  const shuffledCards = [...cardValues, ...cardValues].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 16; i++) {
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${shuffledCards[i].name}">
        <div class="card-before"><img class="jar-mystery" src="images/easylevel/jar-mystery.png"></div>
        <div class="card-after"><img src="${shuffledCards[i].image}" class="image"/></div>
      </div>
    `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(4, auto)`;
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (canClick && !clickCooldown && !card.classList.contains("matched") && !gameWon) {
        handleCardClick(card);
      }
    });
  });
};

const handleCardClick = (card) => {
  if (card === firstCard) return;
  card.classList.add("flipped");
  if (!firstCard) {
    firstCard = card;
  } else {
    movesCounter();
    canClick = false;
    secondCard = card;
    checkForMatch();
  }
};

const checkForMatch = () => {
  const firstCardValue = firstCard.getAttribute("data-card-value");
  const secondCardValue = secondCard.getAttribute("data-card-value");
  if (firstCardValue === secondCardValue) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard = null;
    secondCard = null;
    winCount += 1;
    canClick = true;
    if (winCount === 8) {
      setTimeout(showWinMessage, 500);
    }
  } else {
    clickCooldown = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      clickCooldown = false;
      canClick = true;
    }, 900);
  }
};

const resetGame = () => {
  if (gameContainer) gameContainer.innerHTML = "";
  resetGameState();
  if (moves) moves.innerHTML = `<span>Moves:</span> 0`;
  if (timeValue) timeValue.innerHTML = `<span>Time:</span>01:00`;
  if (easyBg) easyBg.classList.add("hide");
  if (statsContainer) statsContainer.classList.add("hide");
  const existingMessage = document.getElementById("game-message");
  if (existingMessage) {
    existingMessage.remove();
    document.body.style.overflow = '';
  }
};

const stopGame = () => {
  resetGame();
  if (controls) controls.classList.remove("hide");
  if (stopButton) stopButton.classList.add("hide");
  if (startButton) startButton.classList.remove("hide");
};

const startGame = () => {
  resetGameState();
  if (controls) controls.classList.add("hide");
  if (stopButton) stopButton.classList.remove("hide");
  if (startButton) startButton.classList.add("hide");
  if (easyBg) easyBg.classList.remove("hide");
  if (statsContainer) statsContainer.classList.remove("hide");
  interval = setInterval(timeGenerator, 1000);
  if (moves) moves.innerHTML = `<span>Moves:</span> 0`;
  createGameBoard(generateRandomCards());
};

if (startButton) startButton.addEventListener("click", startGame);
if (stopButton) stopButton.addEventListener("click", stopGame);
