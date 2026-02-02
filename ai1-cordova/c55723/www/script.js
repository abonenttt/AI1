const API_KEY = '2a913b3e6d9b48db548fdf2e9095e864';

const input = document.getElementById('cityInput');
const btn = document.getElementById('btnWeather');
const currentContent = document.getElementById('currentContent');
const forecastContent = document.getElementById('forecastContent');

btn.addEventListener('click', () => {
  const city = input.value.trim();
  if (!city) return alert('Wpisz nazwę miasta.');
  getCurrent(city);
  getForecast(city);
});

function getCurrent(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;
  const xhr = new XMLHttpRequest();
  currentContent.innerHTML = 'Ładowanie…';
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    console.log("Odpowiedź CURRENT (XHR):", xhr.response);
    if (xhr.status >= 200 && xhr.status < 300) {
      renderCurrent(xhr.response);
    } else {
      currentContent.innerHTML = 'Błąd podczas pobierania danych.';
    }
  };
  xhr.onerror = function() {
    console.log("Błąd sieci CURRENT");
    currentContent.innerHTML = 'Błąd sieci.';
  };
  xhr.send();
}

function renderCurrent(data) {
  if (!data || data.cod !== 200) {
    currentContent.innerHTML = 'Nie znaleziono miasta.';
    return;
  }
  const name = `${data.name}, ${data.sys.country}`;
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const desc = data.weather[0].description;
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  currentContent.innerHTML = `
    <div class="current-row">
      <img src="${icon}">
      <div>
        <div class="current-temp">${temp}°C</div>
        <div class="small">${name} — ${desc}</div>
        <div class="small">Odczuwalna: ${feels}°C</div>
      </div>
    </div>
  `;
}

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;
  forecastContent.innerHTML = 'Ładowanie…';
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Odpowiedź FORECAST (fetch):", data);
    if (!res.ok) {
      forecastContent.innerHTML = 'Błąd podczas pobierania prognozy.';
      return;
    }
    renderForecast(data);
  } catch (e) {
    console.log("Błąd sieci FORECAST");
    forecastContent.innerHTML = 'Błąd sieci.';
  }
}

function renderForecast(data) {
  if (!data.list || !data.list.length) {
    forecastContent.innerHTML = 'Brak danych.';
    return;
  }
  const groups = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  const days = Object.keys(groups).slice(0, 6);
  const selected = days.map(date => {
    const items = groups[date];
    let pick = items.find(i => i.dt_txt.endsWith('12:00:00'));
    if (!pick) pick = items[0];
    return pick;
  }).slice(0, 5);
  const html = selected.map(item => {
    const dt = new Date(item.dt * 1000);
    const day = dt.toLocaleDateString('pl-PL', { weekday: 'short', day: '2-digit', month: '2-digit' });
    const temp = Math.round(item.main.temp);
    const desc = item.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const hum = item.main.humidity;
    const wind = item.wind.speed;
    return `
      <div class="forecast-day">
        <div class="small">${day}</div>
        <img src="${icon}">
        <div style="font-weight:600">${temp}°C</div>
        <div class="small">${desc}</div>
        <div class="small">Wilgotność: ${hum}% • Wiatr: ${wind} m/s</div>
      </div>
    `;
  }).join('');
  forecastContent.innerHTML = `<div class="forecast-grid">${html}</div>`;
}
