const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const statsContainer = document.querySelector(".stats-container");
const hardBg = document.getElementById("hardbg");
const scoreDisplay = document.getElementById("high-score-display-hard");

let cards;
let interval;
let firstCard = null;
let secondCard = null;
let gameWon = false;
let canClick = true;
let clickCooldown = false;
let movesCount = 0;
let winCount = 0;

let highScore = localStorage.getItem("hardHighScore") 
  ? parseInt(localStorage.getItem("hardHighScore")) 
  : null;

let seconds = 30;
let minutes = 1;

const items = [
  { name: "croffle1", image: "images/hardlevel/croffle1.png" },
  { name: "croffle2", image: "images/hardlevel/croffle2.png" },
  { name: "croffle3", image: "images/hardlevel/croffle3.png" },
  { name: "croffle4", image: "images/hardlevel/croffle4.png" },
  { name: "croffle5", image: "images/hardlevel/croffle5.png" },
  { name: "croffle6", image: "images/hardlevel/croffle6.png" },
  { name: "croffle7", image: "images/hardlevel/croffle7.png" },
  { name: "croffle8", image: "images/hardlevel/croffle8.png" },
  { name: "croffle9", image: "images/hardlevel/croffle9.png" },
  { name: "croffle10", image: "images/hardlevel/croffle10.png" },
  { name: "croffle11", image: "images/hardlevel/croffle11.png" },
  { name: "croffle12", image: "images/hardlevel/croffle12.png" }
];

const initializePage = () => {
  if (stopButton) stopButton.classList.add("hide");
  if (statsContainer) statsContainer.classList.add("hide");
  if (hardBg) hardBg.classList.add("hide");
  if (controls) controls.classList.remove("hide");
  if (startButton) startButton.classList.remove("hide");
  if (result) result.innerHTML = "";
  if (timeValue) timeValue.innerHTML = `<span>Time:</span>01:30`;
  if (moves) moves.innerHTML = `<span>Moves:</span> 0`;
  resetGameState();

  if (scoreDisplay) {
    if (highScore !== null) {
      scoreDisplay.classList.remove("hide");
      scoreDisplay.innerHTML = `<span>"${highScore} moves... Impressive—for a kid. But next time, try acting like a chef, not someone playing pretend."`;
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
  seconds = 30;
  minutes = 1;
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
      <img class="hardguypage2" src="images/sticker-hardguy-uncropped.png">
      <h2>Time's up. No excuses. A real chef respects the clock as much as the recipe. What you served was underbaked, underwhelming, and under pressure—you crumbled. Reset your station. Refocus.</h2>
      <a href="page-levels.html" id="go-back"><img class="button-goback" src="images/button-goback.png"></a>
      <a href="page-score-hard.html" id="hi-score"><img class="button-hiscore" src="images/button-hiscore.png"></a>
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
    localStorage.setItem("hardHighScore", highScore);
  }

  const winMessage = document.createElement("div");
  winMessage.id = "game-message";
  winMessage.innerHTML = `
    <div class="message-content">
      <img class="hardguypage2" src="images/sticker-hardguy-uncropped.png">
      <h2>Acceptable. You matched every ingredient with precision... ${movesCount} moves. That’s the bare minimum in my kitchen. Next time—do it faster, cleaner, sharper.</h2>
      <a href="page-levels.html" id="go-back"><img class="button-goback" src="images/button-goback.png"></a>
      <a href="page-score-hard.html" id="hi-score"><img class="button-hiscore" src="images/button-hiscore.png"></a>
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
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const createGameBoard = (cardValues) => {
  gameContainer.innerHTML = "";
  const shuffledCards = [...cardValues, ...cardValues].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 24; i++) {
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${shuffledCards[i].name}">
        <div class="card-before"><img class="croffle-mystery" src="images/hardlevel/croffle-mystery.png"></div>
        <div class="card-after"><img src="${shuffledCards[i].image}" class="image"/></div>
      </div>
    `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(6, auto)`;
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
    if (winCount === 12) {
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
  if (timeValue) timeValue.innerHTML = `<span>Time:</span>01:30`;
  if (hardBg) hardBg.classList.add("hide");
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
  if (hardBg) hardBg.classList.remove("hide");
  if (statsContainer) statsContainer.classList.remove("hide");
  interval = setInterval(timeGenerator, 1000);
  if (moves) moves.innerHTML = `<span>Moves:</span> 0`;
  createGameBoard(generateRandomCards());
};

if (startButton) startButton.addEventListener("click", startGame);
if (stopButton) stopButton.addEventListener("click", stopGame);
