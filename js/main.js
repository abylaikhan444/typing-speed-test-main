const mainContainer = document.querySelector('.main');
const startButton = document.querySelector('.main__btn');
const restartButton = document.querySelector('.btn-restart');
const blurContainer = document.querySelector('.main__over');
const textQuote = document.querySelector('.main__text');
const hiddenInput = document.querySelector('#input-area');
const timerSpan = document.querySelector('#stat-time');
const wpmSpan = document.querySelector('#stat-wpm');
const accuracySpan = document.querySelector('#stat-accuracy');
// RESULT VARIABLES
const resultContainer = document.querySelector('.typing-result');
const resultTitle = document.querySelector('.typing-result__title');
const resultSubtitle = document.querySelector('.typing-result__subtitle');
const resultWpm = document.querySelector('#result-wpm');
const resultAccuracy = document.querySelector('#result-accuracy');
const resultCorrectWord = document.querySelector('#result-correct');
const resultIncorrectWord = document.querySelector('#result-incorrect');
const resultScore = document.querySelector('.typing-header__score-count');

let data = null;
let isTestRunning = false;
let prevLength = 0;
let totalTyped = 0;
let totalErrors = 0;

async function loadText() {
  const response = await fetch('./data.json');
  return await response.json();
}

async function init() {
  const textContainer = document.querySelector('.main__text');
  const savedBest = localStorage.getItem('personalBest');
  if (savedBest !== null) {
    resultScore.textContent = savedBest + ' WPM';
  }
  data = await loadText(); // теперь это настоящие данные, не Promise
  // console.log(typeof data); // посмотри, какая у них структура

  // достаём конкретный текст
  const randomIndex = Math.floor(Math.random() * data.easy.length);
  const text = data.easy[randomIndex].text;
  // console.log(text); // text current

  const html = text
    .split('')
    .map((char, index) => {
      const isFirst = index === 0 ? 'char--current' : '';
      return `<span class="char ${isFirst}">${char}</span>`;
    })
    .join('');

  textContainer.innerHTML = html;
}

init();

// Старт приложения

function startTest() {
  if (isTestRunning) return;
  isTestRunning = true;
  textQuote.classList.remove('is-blurred');
  blurContainer.classList.add('is-hidden');
  restartButton.classList.remove('is-hidden');
  hiddenInput.focus();
  startTimer();
}
startButton.addEventListener('click', () => {
  startTest();
});
textQuote.addEventListener('click', () => {
  startTest();
});

hiddenInput.addEventListener('input', () => {
  const typedText = hiddenInput.value;
  const charSpans = textQuote.querySelectorAll('.char');
  const currentLength = typedText.length;

  if (currentLength > prevLength) {
    totalTyped++;
    const lastIndex = currentLength - 1;
    if (typedText[lastIndex] !== charSpans[lastIndex].textContent) {
      totalErrors++;
    }
  }
  prevLength = currentLength;

  for (let i = 0; i < charSpans.length; i++) {
    if (i < typedText.length) {
      if (typedText[i] === charSpans[i].textContent) {
        charSpans[i].className = 'char char--correct';
      } else {
        charSpans[i].className = 'char char--incorrect';
      }
    } else if (i === typedText.length) {
      charSpans[i].className = 'char char--current';
    } else {
      charSpans[i].className = 'char';
    }
  }

  if (typedText.length === charSpans.length) {
    finishTest();
  }
  updateStats();
});

function formatTime(seconds) {
  const minute = String(Math.floor(seconds / 60));
  const second = String(seconds % 60);
  const result = minute + ':' + second.padStart(2, '0');
  return result;
}

let timeLeft = 60;
let timerId = null;

function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerId);
      finishTest();
      console.log('Время вышло!');
    }
    updateStats();
  }, 1000);
}

function updateStats() {
  const correctsChar = document.querySelectorAll('.char--correct').length;
  const timeElapsed = 60 - timeLeft;
  const timeInMinutes = timeElapsed / 60;
  let newWpm = 0;
  if (timeElapsed > 0) {
    newWpm = Math.round(correctsChar / 5 / timeInMinutes);
  }
  wpmSpan.textContent = String(newWpm);
  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - totalErrors) / totalTyped) * 100) : 0;
  accuracySpan.textContent = String(accuracy) + '%';
}

function finishTest() {
  clearInterval(timerId);
  isTestRunning = false;
  hiddenInput.blur();

  mainContainer.classList.add('is-hidden');
  restartButton.classList.add('is-hidden');
  resultContainer.classList.remove('is-hidden');
  resultWpm.textContent = wpmSpan.textContent;
  resultAccuracy.textContent = accuracySpan.textContent;
  resultCorrectWord.textContent = document.querySelectorAll('.char--correct').length;
  resultIncorrectWord.textContent = totalErrors;

  const currentWpm = Number(wpmSpan.textContent);
  const savedBest = localStorage.getItem('personalBest');

  if (savedBest === null) {
    resultTitle.textContent = 'Baseline Established!';
    resultSubtitle.textContent = "You've set the bar. Now the real challenge begins—time to beat it.";
    localStorage.setItem('personalBest', currentWpm);
    resultScore.textContent = currentWpm + ' WPM';
  } else if (currentWpm > Number(savedBest)) {
    resultTitle.textContent = 'High Score Smashed!';
    resultSubtitle.textContent = "You're getting faster. That was incredible typing.";
    localStorage.setItem('personalBest', currentWpm);
    resultScore.textContent = currentWpm + ' WPM';
  } else {
    resultTitle.textContent = 'Test Complete!';
    resultSubtitle.textContent = 'Solid run. Keep pushing to beat your high score.';
  }
}

function restartTest() {
  
}
