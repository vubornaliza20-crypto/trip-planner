/**
 * Публічний API: CountriesNow API (інформація про країни, столиці та населення)
 * Посилання: https://countriesnow.space/api/v0.1/countries/capital
 * Додатковий ендпоінт для населення: https://countriesnow.space/api/v0.1/countries/population
 */
const API_URL = 'https://countriesnow.space/api/v0.1/countries/capital';
const POPULATION_API_URL = 'https://countriesnow.space/api/v0.1/countries/population';

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

const countriesListContainer = document.querySelector('#countries-list');
const countrySearchForm = document.querySelector('#country-search-form');
const countryInput = document.querySelector('#country-input');
const searchCountryBtn = document.querySelector('#search-country-btn');
const apiLoadingElement = document.querySelector('#api-loading');
const apiErrorElement = document.querySelector('#api-error');
const refreshCountryBtn = document.querySelector('#refresh-country-btn');

// Увімкнення/вимкнення стану завантаження
function setLoadingState(isLoading) {
  apiLoadingElement.style.display = isLoading ? 'block' : 'none';
  searchCountryBtn.disabled = isLoading;
  refreshCountryBtn.disabled = isLoading;
}

// Крок 6: Функція рендеру картки країни в DOM
function renderCountries(countriesArray) {
  countriesListContainer.innerHTML = '';

  countriesArray.forEach(country => {
    const card = document.createElement('article');
    card.classList.add('card');

    const flagImg = document.createElement('img');
    flagImg.src = country.flags.png;
    flagImg.alt = `Прапор: ${country.name.common}`;
    flagImg.style.maxHeight = '140px';
    flagImg.style.objectFit = 'cover';

    const title = document.createElement('h3');
    title.textContent = country.name.common;

    const capitalInfo = document.createElement('p');
    capitalInfo.textContent = `Столиця: ${country.capital}`;

    const populationInfo = document.createElement('p');
    populationInfo.textContent = `Населення: ${country.population.toLocaleString('uk-UA')} осіб`;

    card.append(flagImg, title, capitalInfo, populationInfo);
    countriesListContainer.append(card);
  });
}

async function loadData(countryName) {
  apiErrorElement.textContent = '';
  setLoadingState(true);
  try {
    const response = await fetch(API_URL);
    const popResponse = await fetch(POPULATION_API_URL);

    if (!response.ok) {
      throw new Error(`Помилка HTTP: сервер відповів кодом ${response.status}`);
    }

    const data = await response.json();
    const popData = await popResponse.json();
    console.log('Отримані дані з API:', data);

    const foundCountry = data.data.find(
      item => item.name.toLowerCase() === countryName.trim().toLowerCase()
    );

    if (!foundCountry) {
      throw new Error('NOT_FOUND'); // генеруємо помилку, якщо країну не знайдено
    }


    const foundPop = popData.data.find(item => item.code === foundCountry.iso3);
    const populationValue = foundPop?.populationCounts?.at(-1)?.value || 0;

    const countryObject = {
      name: { common: foundCountry.name },
      capital: foundCountry.capital || 'Немає столиці',
      population: populationValue,
      flags: { png: `https://flagcdn.com/w320/${foundCountry.iso2.toLowerCase()}.png` }
    };

      renderCountries([countryObject]);

  } catch (error) {
    countriesListContainer.innerHTML = '';

    if (error.message === 'NOT_FOUND') {
      apiErrorElement.textContent = 'Країну не знайдено, перевірте написання';
    } else {
      apiErrorElement.textContent = 'Не вдалося завантажити дані. Перевірте з’єднання з інтернетом.';
    }
    console.error(error);
  } finally {
    setLoadingState(false);
  }
}

countrySearchForm.addEventListener('submit', event => {
  event.preventDefault();
  loadData(countryInput.value);
});

// Повторний виклик loadData() при натисканні на кнопку «Оновити»
refreshCountryBtn.addEventListener('click', () => {
  loadData(countryInput.value || 'Ukraine');
});
loadData('Ukraine');
