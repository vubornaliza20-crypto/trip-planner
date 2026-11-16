// Масив об'єктів із даними про подорожі ( destination, days, budget )
const trips = [
  { destination: 'Париж, Франція', days: 5, budget: 1800 },
  { destination: 'Токіо, Японія', days: 10, budget: 2500 }
];

// Знаходимо всі статичні картки всередині контейнера і видаляємо їх з DOM
const staticCards = document.querySelectorAll('#trips-list .card');
staticCards.forEach(card => card.remove());

// Вибираємо контейнер списку та елемент підсумку
const listContainer = document.querySelector('#trips-list');
const tripsCountElement = document.querySelector('#trips-count');

// Функція для перебору масиву циклом for...of та виведення інформації про кожну подорож
function showTrips(tripsArray) {
  console.log('--- Список подорожей ---');
  for (const trip of tripsArray) {
    console.log(`Подорож: ${trip.destination}, Тривалість: ${trip.days} днів, Бюджет: ${trip.budget} грн`);
  }
}
showTrips(trips);

// Функція для класифікації подорожей за бюджетом (бюджетна або дорога) за допомогою умови if/else
function classifyTrips(tripsArray) {
  console.log('--- Класифікація подорожей за бюджетом ---');

  for (const trip of tripsArray) {
    let category = '';

    if (trip.budget >= 2000) {
      category = 'дорога';
    } else {
      category = 'бюджетна';
    }

    console.log(`Подорож у ${trip.destination} (бюджет: ${trip.budget} грн) — це ${category} подорож.`);
  }
}
classifyTrips(trips);

// Стрілкова функція для обчислення середньої вартості одного дня подорожі
const costPerDay = trip => Math.round(trip.budget / trip.days);
console.log('--- Вартість одного дня подорожі ---');
for (const trip of trips) {
  const dailyCost = costPerDay(trip);
  console.log(`Середні витрати на день у ${trip.destination}: ${dailyCost} грн/день`);
}

// Функція рендеру списку подорожей у DOM:
// 1. Очищає контейнер #trips-list.
// 2. Створює картку подорожі (article) для кожного елемента масиву.
// 3. Заповнює назву (h3) та деталі (p: дні й бюджет).
// 4. Розраховує та додає атрибут data-cost-per-day.
// 5. Класифікує подорож додаванням класу budget або expensive.
// 6. Додає картку в контейнер та оновлює лічильник p#trips-count.
function renderTrips(tripsArray) {
  listContainer.innerHTML = '';

  tripsArray.forEach(trip => {
    const card = document.createElement('article');
    card.classList.add('card');

    const title = document.createElement('h3');
    title.textContent = trip.destination;

    const details = document.createElement('p');
    details.textContent = `${trip.days} днів, ${trip.budget} грн`;

    card.append(title, details);

    const dailyCost = costPerDay(trip);
    card.dataset.costPerDay = dailyCost;

    if (trip.budget >= 2000) {
      card.classList.add('expensive');
    } else {
      card.classList.add('budget');
    }
    listContainer.append(card);
  });
  if (tripsCountElement) {
    tripsCountElement.textContent = `Всього подорожей у списку: ${tripsArray.length}`;
  }
}
renderTrips(trips);


const tripForm = document.querySelector('#trip-form');
const destinationInput = document.querySelector('#destination');
const daysInput = document.querySelector('#days');
const budgetInput = document.querySelector('#budget');

tripForm.addEventListener('submit', event => {
  event.preventDefault();

  const destination = destinationInput.value.trim();
  const days = Number(daysInput.value);
  const budget = Number(budgetInput.value);

  const newTrip = {
    destination,
    days,
    budget
  };
  trips.push(newTrip);

  renderTrips(trips);
  tripForm.reset();
  budgetWarningElement.textContent = '';
});


// Додаткова валідація — перерахунок вартості дня «на льоту» та попередження
const budgetWarningElement = document.querySelector('#budget-warning');
const MIN_DAILY_BUDGET = 300; // Розумний мінімальний поріг бюджету на день (грн)

function validateDailyBudget() {
  const days = Number(daysInput.value);
  const budget = Number(budgetInput.value);

  // Перевіряємо, чи введені коректні числа, щоб уникнути ділення на 0 або NaN
  if (days > 0 && budgetInput.value !== '') {
    const dailyCost = costPerDay({ days, budget });

    if (dailyCost < MIN_DAILY_BUDGET) {
      budgetWarningElement.textContent = `Вартість дня: ${dailyCost} грн/день. Увага: бюджет на день менший за рекомендований поріг (${MIN_DAILY_BUDGET} грн)!`;
      budgetWarningElement.style.color = '#dc2626';
    } else {
      budgetWarningElement.textContent = `Орієнтовна вартість одного дня: ${dailyCost} грн/день.`;
      budgetWarningElement.style.color = '#15803d';
    }
  } else {
    budgetWarningElement.textContent = '';
  }
}

daysInput.addEventListener('input', validateDailyBudget);
budgetInput.addEventListener('input', validateDailyBudget);


// Делегування події click на контейнер списку карток для показу деталей подорожі
const detailsSection = document.querySelector('#details');

listContainer.addEventListener('click', event => {
  // Знаходимо найближчу картку, по якій відбувся клік
  const clickedCard = event.target.closest('.card');
  if (!clickedCard) return;

  // Отримуємо назву подорожі із заголовка картки та шукаємо її в масиві trips
  const destinationTitle = clickedCard.querySelector('h3').textContent;
  const selectedTrip = trips.find(trip => trip.destination === destinationTitle);

  if (selectedTrip) {
    const dailyCost = costPerDay(selectedTrip);
    const category = selectedTrip.budget >= 2000 ? 'Дорога подорож' : 'Бюджетна подорож';

    // Оновлюємо вміст блоку #details
    detailsSection.innerHTML = `
      <h2>Деталі обраної подорожі</h2>
      <p><strong>Напрямок:</strong> ${selectedTrip.destination}</p>
      <p><strong>Тривалість:</strong> ${selectedTrip.days} днів</p>
      <p><strong>Загальний бюджет:</strong> ${selectedTrip.budget} грн</p>
      <p><strong>Середні витрати на день:</strong> ${dailyCost} грн/день (${category})</p>
    `;
  }
});

