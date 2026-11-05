const dropdowns = document.querySelectorAll('.dropdown');

function closeAll() {
  dropdowns.forEach((d) => d.classList.remove('is-open'));
}

dropdowns.forEach((dropdown) => {
  const valueEl = dropdown.querySelector('.dropdown__value');
  const radios = dropdown.querySelectorAll('input[type="radio"]');

  // 2. Выбор варианта: обновить текст и закрыть
  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      valueEl.textContent = radio.value;
      dropdown.classList.remove('is-open');
    });
  });
});

// 1. Клик по кнопке: открыть/закрыть
const btnChanllenge = document.querySelector('#btn-challenge');
const btnTimer = document.querySelector('#btn-timer');

btnChanllenge.addEventListener('click', () => {
  const wasOpen = btnChanllenge.parentElement.classList.contains('is-open');
  closeAll(); // сначала закрываем все
  if (!wasOpen) btnChanllenge.parentElement.classList.add('is-open'); // открываем, если было закрыто
});
btnTimer.addEventListener('click', () => {
  const wasOpen = btnTimer.parentElement.classList.contains('is-open');
  closeAll(); // сначала закрываем все
  if (!wasOpen) btnTimer.parentElement.classList.add('is-open'); // открываем, если было закрыто
});
// 3. Клик мимо меню: закрыть всё
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) closeAll();
});
