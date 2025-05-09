const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const statsContainer = document.querySelector(".stats-container");
const mediumBg = document.getElementById("mediumbg");
const scoreDisplay = document.getElementById("high-score-display-medium");

let cards;
let interval;
let firstCard = null;
let secondCard = null;
let gameWon = false;
let canClick = true;
let clickCooldown = false;
let movesCount = 0;
let winCount = 0;

let highScore = localStorage.getItem("mediumHighScore") 
  ? parseInt(localStorage.getItem("mediumHighScore")) 
  : null;

let seconds = 15;
let minutes = 1;

const items = [
  { name: "toast1", image: "images/mediumlevel/toast1.png" },
  { name: "toast2", image: "images/mediumlevel/toast2.png" },
  { name: "toast3", image: "images/mediumlevel/toast3.png" },
  { name: "toast4", image: "images/mediumlevel/toast4.png" },
  { name: "toast5", image: "images/mediumlevel/toast5.png" },
  { name: "toast6", image: "images/mediumlevel/toast6.png" },
  { name: "toast7", image: "images/mediumlevel/toast7.png" },
  { name: "toast8", image: "images/mediumlevel/toast8.png" },
  { name: "toast9", image: "images/mediumlevel/toast9.png" },
  { name: "toast10", image: "images/mediumlevel/toast10.png" }
];

const initializePage = () => {
  if (stopButton) stopButton.classList.add("hide");
  if (statsContainer) statsContainer.classList.add("hide");
  if (mediumBg) mediumBg.classList.add("hide");
  if (controls) controls.classList.remove("hide");
  if (startButton) startButton.classList.remove("hide");
  if (result) result.innerHTML = "";
  if (timeValue) timeValue.innerHTML = `<span>Time:</span>01:15`;
  if (moves) moves.innerHTML = `<span>Moves:</span> 0`;
  resetGameState();

  if (scoreDisplay) {
    if (highScore !== null) {
      scoreDisplay.classList.remove("hide");
      scoreDisplay.innerHTML = `<span>Your highest score is... ${highScore} moves! That's some perfectly toasted success, darling!</span>`;
    } else {
      scoreDisplay.classList.remove("hide");
      scoreDisplay.innerHTML = `<span>No toast toppings yet—the kitchen awaits your artistry!</span>`;
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
  seconds = 15;
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
      <img class="mediumguypage2" src="images/sticker-mediumguy-uncropped.png">
      <h2>Sweetie… the timer has expired, and so has my patience. Were we baking or taking a nap? Tsk. Go powder your nose and come back with flair. I expect nothing less than fabulous.</h2>
      <a href="page-levels.html" id="go-back"><img class="button-goback" src="images/button-goback.png"></a>
      <a href="page-score-medium.html" id="hi-score"><img class="button-hiscore" src="images/button-hiscore.png"></a>
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
    localStorage.setItem("mediumHighScore", highScore);
    if (scoreDisplay) {
      scoreDisplay.innerHTML = `<span>Your highest score is... ${highScore} moves! That's some perfectly toasted success, darling!</span>`;
    }
  }

  const winMessage = document.createElement("div");
  winMessage.id = "game-message";
  winMessage.innerHTML = `
    <div class="message-content">
      <img class="mediumguypage2" src="images/sticker-mediumguy-uncropped.png">
      <h2>Oh, finally! I was beginning to think we'd be stuck swirling butter forever. But I'm impressed you did it in ${movesCount} moves. Bravo, darling. Now go strike a pose with your pastries.</h2>
      <a href="page-levels.html" id="go-back"><img class="button-goback" src="images/button-goback.png"></a>
      <a href="page-score-medium.html" id="hi-score"><img class="button-hiscore" src="images/button-hiscore.png"></a>
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
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const createGameBoard = (cardValues) => {
  gameContainer.innerHTML = "";
  const shuffledCards = [...cardValues, ...cardValues].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 20; i++) {
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${shuffledCards[i].name}">
        <div class="card-before"><img class="toast-mystery" src="images/mediumlevel/toast-mystery.png"></div>
        <div class="card-after"><img src="${shuffledCards[i].image}" class="image"/></div>
      </div>
    `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(5, auto)`;
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
    if (winCount === 10) {
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
  if (timeValue) timeValue.innerHTML = `<span>Time:</span>01:15`;
  if (mediumBg) mediumBg.classList.add("hide");
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
  if (mediumBg) mediumBg.classList.remove("hide");
  if (statsContainer) statsContainer.classList.remove("hide");
  interval = setInterval(timeGenerator, 1000);
  if (moves) moves.innerHTML = `<span>Moves:</span> 0`;
  createGameBoard(generateRandomCards());
};

if (startButton) startButton.addEventListener("click", startGame);
if (stopButton) stopButton.addEventListener("click", stopGame);
