console.log('script.js підключено');

// Масив об'єктів із даними про подорожі ( destination, days, budget )
const trips = [
  { destination: 'Париж, Франція', days: 5, budget: 1800 },
  { destination: 'Токіо, Японія', days: 10, budget: 2500 }
];

// Функція для перебору масиву циклом for...of та виведення інформації про кожну подорож
function showTrips(tripsArray) {
  console.log('--- Список подорожей ---');
  for (const trip of tripsArray) {
    console.log(`Подорож: ${trip.destination}, Тривалість: ${trip.days} днів, Бюджет: $${trip.budget}`);
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

    console.log(`Подорож у ${trip.destination} (бюджет: $${trip.budget}) — це ${category} подорож.`);
  }
}
classifyTrips(trips);

// Стрілкова функція для обчислення середньої вартості одного дня подорожі
const costPerDay = trip => Math.round(trip.budget / trip.days);
console.log('--- Вартість одного дня подорожі ---');
for (const trip of trips) {
  const dailyCost = costPerDay(trip);
  console.log(`Середні витрати на день у ${trip.destination}: $${dailyCost}/день`);
}

