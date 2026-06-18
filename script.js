let secretNumber = 0;
let attempts = 0;
let guesses = [];
let gameActive = false;
let currentMode = null; // 'normal' or 'range'
let currentDifficulty = null; // 'easy', 'medium', 'hard'
let rangeMin = 1;
let rangeMax = 100;

// DOM Elements
const homeScreen = document.getElementById('homeScreen');
const difficultyScreen = document.getElementById('difficultyScreen');
const gameScreen = document.getElementById('gameScreen');
const normalModeBtn = document.getElementById('normalModeBtn');
const rangeModeBtn = document.getElementById('rangeModeBtn');
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const startBtn = document.getElementById('startBtn');
const guessBtn = document.getElementById('guessBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const homeBtn = document.getElementById('homeBtn');
const homeBtn2 = document.getElementById('homeBtn2');
const guessInput = document.getElementById('guessInput');
const gameContainer = document.getElementById('gameContainer');
const gameOverDiv = document.getElementById('gameOver');
const messageEl = document.getElementById('message');
const attemptsEl = document.getElementById('attempts');
const guessList = document.getElementById('guessList');
const historyDiv = document.getElementById('history');
const modeTitle = document.getElementById('modeTitle');

// Event Listeners
normalModeBtn.addEventListener('click', () => selectMode('normal'));
rangeModeBtn.addEventListener('click', () => selectMode('range'));
easyBtn.addEventListener('click', () => selectDifficulty('easy'));
mediumBtn.addEventListener('click', () => selectDifficulty('medium'));
hardBtn.addEventListener('click', () => selectDifficulty('hard'));
startBtn.addEventListener('click', startNewGame);
guessBtn.addEventListener('click', makeGuess);
playAgainBtn.addEventListener('click', startNewGame);
homeBtn.addEventListener('click', goHome);
homeBtn2.addEventListener('click', goHome);
guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') makeGuess();
});

function selectMode(mode) {
  currentMode = mode;
  
  if (mode === 'normal') {
    homeScreen.classList.add('hidden');
    difficultyScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    modeTitle.textContent = 'Normal Mode - Guess a number between 1-100';
  } else if (mode === 'range') {
    homeScreen.classList.add('hidden');
    difficultyScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
  }
}

function selectDifficulty(difficulty) {
  currentDifficulty = difficulty;
  difficultyScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  
  const difficultyText = {
    easy: 'Easy Mode - Large Range',
    medium: 'Medium Mode - Normal Range',
    hard: 'Hard Mode - Small Range'
  };
  
  modeTitle.textContent = `Range Mode - ${difficultyText[difficulty]}!`;
}

function goHome() {
  homeScreen.classList.remove('hidden');
  difficultyScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  gameContainer.classList.add('hidden');
  gameOverDiv.classList.add('hidden');
  startBtn.classList.remove('hidden');
  currentMode = null;
  currentDifficulty = null;
  gameActive = false;
}

function generateRangeMode() {
  // Generate a random range based on difficulty
  let rangeSize;
  
  if (currentDifficulty === 'easy') {
    rangeSize = Math.floor(Math.random() * 10) + 8; // 8-18 (small range = easy)
  } else if (currentDifficulty === 'medium') {
    rangeSize = Math.floor(Math.random() * 20) + 20; // 20-40
  } else if (currentDifficulty === 'hard') {
    rangeSize = Math.floor(Math.random() * 20) + 40; // 40-60 (large range = hard)
  }
  
  rangeMin = Math.floor(Math.random() * (100 - rangeSize));
  rangeMax = rangeMin + rangeSize;
  secretNumber = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
}

function startNewGame() {
  attempts = 0;
  guesses = [];
  gameActive = true;
  
  if (currentMode === 'range') {
    generateRangeMode();
  } else {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    rangeMin = 1;
    rangeMax = 100;
  }
  
  // Update UI
  startBtn.classList.add('hidden');
  gameOverDiv.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  historyDiv.classList.add('hidden');
  guessList.innerHTML = '';
  
  if (currentMode === 'range') {
    messageEl.textContent = `🎮 Game started! Guess a number between ${rangeMin} and ${rangeMax}!`;
  } else {
    messageEl.textContent = '🎮 Game started! Start guessing!';
  }
  messageEl.className = 'message';
  attemptsEl.textContent = 'Attempts: 0';
  guessInput.min = rangeMin;
  guessInput.max = rangeMax;
  guessInput.placeholder = `Enter your guess (${rangeMin}-${rangeMax})`;
  guessInput.value = '';
  guessInput.focus();
}

function makeGuess() {
  if (!gameActive) return;

  const guess = guessInput.value.trim();
  
  if (!guess) {
    messageEl.textContent = 'Please enter a number!';
    messageEl.className = 'message hint';
    return;
  }

  const guessNum = parseInt(guess);

  if (isNaN(guessNum) || guessNum < rangeMin || guessNum > rangeMax) {
    messageEl.textContent = `Please guess a number between ${rangeMin} and ${rangeMax}`;
    messageEl.className = 'message hint';
    return;
  }

  attempts++;
  guesses.push(guessNum);
  attemptsEl.textContent = `Attempts: ${attempts}`;

  if (guessNum === secretNumber) {
    messageEl.textContent = `🎉 You got it! The number was ${secretNumber}. It took ${attempts} attempts.`;
    messageEl.className = 'message correct';
    endGame(`🎉 You got it! The number was ${secretNumber}.\nIt took ${attempts} attempts.`);
  } else if (guessNum < secretNumber) {
    messageEl.textContent = '📈 Too low! Try a higher number.';
    messageEl.className = 'message hint';
  } else {
    messageEl.textContent = '📉 Too high! Try a lower number.';
    messageEl.className = 'message hint';
  }

  updateHistory();
  guessInput.value = '';
  guessInput.focus();
}

function updateHistory() {
  if (guesses.length > 0) {
    historyDiv.classList.remove('hidden');
    guessList.innerHTML = guesses.map(g => `<li>${g}</li>`).join('');
  }
}

function endGame(message) {
  gameActive = false;
  gameContainer.classList.add('hidden');
  gameOverDiv.classList.remove('hidden');
  document.getElementById('finalMessage').textContent = message;
}
