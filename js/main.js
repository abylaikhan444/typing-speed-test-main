async function loadText() {
  const response = await fetch('./data.json');
  return await response.json();
}

let data = null;

async function init() {
  const textContainer = document.querySelector('.main__text');
  data = await loadText(); // теперь это настоящие данные, не Promise
  console.log(typeof data); // посмотри, какая у них структура

  // достаём конкретный текст
  const randomIndex = Math.floor(Math.random() * data.easy.length);
  const text = data.easy[randomIndex].text;
  console.log(text); // text current

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

const startButton = document.querySelector('.main__btn');
const restartButton = document.querySelector('.btn-restart');
const blurContainer = document.querySelector('.main__over');
const textQuote = document.querySelector('.main__text');
const hiddenInput = document.querySelector('#input-area');

function startTest() {
  textQuote.classList.remove('is-blurred');
  blurContainer.classList.add('is-hidden');
  restartButton.classList.remove('is-hidden');
  hiddenInput.focus();
}
startButton.addEventListener('click', () => {
  startTest();
});
textQuote.addEventListener('click', () => {
  startTest();
});
