document.addEventListener("DOMContentLoaded", () => {
  init();
});

const toggleButton = document.querySelector(".toggle");
const body = document.querySelector("body");
const testButton = document.querySelector(".test-button");
const API_KEY = "4eade230278c11e0506daa8347945be6";
const hourlyMain = document.querySelector(".hourly-main");
const cityInput = document.querySelector(".city-input");
const suggestionsDropdown = document.querySelector(".suggestions-dropdown");
const cityCards = document.querySelector(".city-cards");
const popup = document.querySelector(".popup");
const hourlyInput = document.querySelector(".forecast-input");
const popupClose = document.querySelector(".popup-close");
const globe = document.querySelector(".globe");
const hourlyTempCanvas = document.querySelector(".hourly-temp-chart");
const hourlyTempCtx = hourlyTempCanvas.getContext("2d");

const hourlyPrecipitationCanvas = document.querySelector(
  ".hourly-precipitation-chart",
);
const hourlyPrecipitationCtx = hourlyPrecipitationCanvas.getContext("2d");

const hourlyHumidityCanvas = document.querySelector(".hourly-humidity-chart");
const hourlyHumidityCtx = hourlyHumidityCanvas.getContext("2d");

const hourlyPressureCanvas = document.querySelector(".hourly-pressure-chart");
const hourlyPressureCtx = hourlyPressureCanvas.getContext("2d");

const hourlyUVCanvas = document.querySelector(".hourly-uv-chart");
const hourlyUVCtx = hourlyUVCanvas.getContext("2d");

const hourlyWindSpeedCanvas = document.querySelector(
  ".hourly-wind-speed-chart",
);
const hourlyWindSpeedCtx = hourlyWindSpeedCanvas.getContext("2d");

const dailyPrecipitationCanvas = document.querySelector(
  ".daily-precipitation-chart",
);
const dailyPrecipitationCtx = dailyPrecipitationCanvas.getContext("2d");

const dailyTempMaxCanvas = document.querySelector(".daily-temp-max-chart");
const dailyTempMaxCtx = dailyTempMaxCanvas.getContext("2d");

const dailyTempMinCanvas = document.querySelector(".daily-temp-min-chart");
const dailyTempMinCtx = dailyTempMinCanvas.getContext("2d");

const dailySunshineDurationCanvas = document.querySelector(
  ".daily-sunshine-duration",
);
const dailySunshineDurationCtx = dailySunshineDurationCanvas.getContext("2d");

const dailyUvCanvas = document.querySelector(".daily-uv-chart");
const dailyUvCtx = dailyUvCanvas.getContext("2d");

const dailyWindSpeedCanvas = document.querySelector(".daily-wind-speed-chart");
const dailyWindSpeedCtx = dailyWindSpeedCanvas.getContext("2d");

const forecastSuggestionsDropdown = document.querySelector(
  ".forecast-suggestions-dropdown",
);
import * as THREE from "https://esm.sh/three";

const MAX_CITIES = 8;
function init() {
  const lightModeOn = localStorage.getItem("light_mode");
  if (lightModeOn === "enabled") {
    body.classList.add("light-mode");
  }

  const world = new Globe(globe, { animateIn: false })
    .globeImageUrl(
      "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg",
    )
    .bumpImageUrl(
      "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png",
    )
    .backgroundColor("rgba(0,0,0,0)");

  // Auto-rotate
  world.controls().autoRotate = true;
  world.controls().autoRotateSpeed = 0.35;

  // Add clouds sphere
  const CLOUDS_IMG_URL = "./clouds.png"; // from https://github.com/turban/webgl-earth
  const CLOUDS_ALT = 0.004;
  const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

  new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(
        world.getGlobeRadius() * (1 + CLOUDS_ALT),
        65,
        65,
      ),
      new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true }),
    );
    world.scene().add(clouds);

    (function rotateClouds() {
      clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
      requestAnimationFrame(rotateClouds);
    })();
  });

  weatherMap();
}

async function fetchSuggestionAPI(inputValue) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=3&appid=${API_KEY}`,
  );
  const data = await response.json();

  data.forEach((el) => {
    renderSuggestion(el.name, el.country, el.lat, el.lon);
  });
}

function renderSuggestion(city, country, lat, lon) {
  const newSuggestion = document.createElement("div");
  newSuggestion.classList.add("suggestion");

  const location = document.createElement("h1");
  location.textContent = `${city}, ${country}`;
  newSuggestion.appendChild(location);

  newSuggestion.addEventListener("click", () => {
    cityInput.value = "";
    suggestionsDropdown.replaceChildren();
    fetchWeatherAPI(lat, lon);
  });

  suggestionsDropdown.appendChild(newSuggestion);
}

async function fetchWeatherAPI(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
  );
  const data = await response.json();

  const cityData = {
    name: data.name,
    country: data.sys.country,
    temp: data.main.temp.toFixed(1),
    weather: data.weather[0].description,
    feelsLike: data.main.feels_like.toFixed(1),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    pressure: data.main.pressure,
  };

  renderWeatherCard(cityData);
}

function saveCitiesToLocalStorage() {
  const cards = document.querySelectorAll(".city-card");
  const citiesToSave = [];

  cards.forEach((card) => {
    const cityLocation = card.querySelector(".top h1:first-child").textContent;
    const [cityName, countryCode] = cityLocation.split(", ");

    const temp = card
      .querySelector(".middle h3:first-child")
      .textContent.replace("°C", "");
    const weather = card.querySelector(".middle h3:last-child").textContent;
    const feelsLike = card
      .querySelector(".bottom h6:nth-child(1)")
      .textContent.split(": ")[1]
      .replace("°C", "");
    const humidity = card
      .querySelector(".bottom h6:nth-child(2)")
      .textContent.split(": ")[1]
      .replace("%", "");
    const windSpeed = card
      .querySelector(".bottom h6:nth-child(3)")
      .textContent.split(": ")[1]
      .replace(" km/hr", "");
    const pressure = card
      .querySelector(".bottom h6:nth-child(4)")
      .textContent.split(": ")[1]
      .replace(" hPa", "");

    citiesToSave.push({
      name: cityName,
      country: countryCode,
      temp: parseFloat(temp),
      weather: weather,
      feelsLike: parseFloat(feelsLike),
      humidity: parseInt(humidity),
      windSpeed: parseFloat(windSpeed),
      pressure: parseInt(pressure),
    });
  });

  localStorage.setItem("atmos_cities", JSON.stringify(citiesToSave));
}

function loadCitiesFromStorage() {
  const savedData = localStorage.getItem("atmos_cities");
  if (!savedData) return;

  const savedCities = JSON.parse(savedData);
  if (savedCities.length === 0) return;

  savedCities.forEach((cityData) => {
    renderWeatherCard(cityData);
  });
}

function renderWeatherCard(data) {
  if (cityCards.children.length >= MAX_CITIES) {
    popup.classList.remove("hidden");
    return;
  }

  const cityCard = document.createElement("div");
  cityCard.classList.add("city-card");

  const top = document.createElement("div");
  top.classList.add("top");

  const cityLocation = document.createElement("h1");
  cityLocation.textContent = `${data.name}, ${data.country}`;
  top.appendChild(cityLocation);

  const closeBtn = document.createElement("h1");
  closeBtn.textContent = "❌";
  top.appendChild(closeBtn);

  const middle = document.createElement("div");
  middle.classList.add("middle");
  const temp = document.createElement("h3");
  temp.textContent = `${data.temp}°C`;
  middle.appendChild(temp);

  const weather = document.createElement("h3");
  weather.textContent = data.weather;
  middle.appendChild(weather);

  const bottom = document.createElement("div");
  bottom.classList.add("bottom");

  const feelsLike = document.createElement("h6");
  feelsLike.textContent = `Feels like: ${data.feelsLike}°C`;
  bottom.appendChild(feelsLike);

  const humidity = document.createElement("h6");
  humidity.textContent = `Humidity: ${data.humidity}%`;
  bottom.appendChild(humidity);

  const windSpeed = document.createElement("h6");
  windSpeed.textContent = `Wind: ${data.windSpeed} km/hr`;
  bottom.appendChild(windSpeed);

  const pressure = document.createElement("h6");
  pressure.textContent = `Pressure: ${data.pressure} hPa`;
  bottom.appendChild(pressure);

  cityCard.appendChild(top);
  cityCard.appendChild(middle);
  cityCard.appendChild(bottom);
  cityCards.appendChild(cityCard);

  saveCitiesToLocalStorage();

  closeBtn.addEventListener("click", () => {
    cityCard.remove();
    saveCitiesToLocalStorage();
  });
}

toggleButton.addEventListener("click", function () {
  body.classList.toggle("light-mode");
  if (body.classList.contains("light-mode")) {
    localStorage.setItem("light_mode", "enabled");
  } else {
    localStorage.removeItem("light_mode");
  }
});

cityInput.addEventListener("input", (e) => {
  e.preventDefault();
  suggestionsDropdown.replaceChildren();
  if (e.target.value.length > 2) {
    fetchSuggestionAPI(e.target.value);
  }
});

popupClose.addEventListener("click", () => {
  popup.classList.add("hidden");
});

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.classList.add("hidden");
  }
});

function getUserLocation() {
  if (!navigator.geolocation) {
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    await fetchWeatherAPI(lat, lon);
  });
}

loadCitiesFromStorage();

if (cityCards.children.length === 0) {
  getUserLocation();
}

async function fetchSuggestionAPIForHourly(inputValue) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=3&appid=${API_KEY}`,
  );
  const data = await response.json();
  data.forEach((el) => {
    renderHourlySuggestion(el.name, el.country, el.lat, el.lon);
  });
}

hourlyInput.addEventListener("input", (e) => {
  e.preventDefault();
  forecastSuggestionsDropdown.replaceChildren();
  if (e.target.value.length > 2) {
    fetchSuggestionAPIForHourly(e.target.value);
  }
});

function renderHourlySuggestion(city, country, lat, lon) {
  const newSuggestion = document.createElement("div");
  newSuggestion.classList.add("suggestion");
  newSuggestion.classList.add("hourly-suggestion");

  const location = document.createElement("h1");
  location.textContent = `${city}, ${country}`;
  newSuggestion.appendChild(location);

  newSuggestion.addEventListener("click", () => {
    hourlyInput.value = "";
    forecastSuggestionsDropdown.replaceChildren();
    document.querySelector(".notice").classList.add("hidden");
    fetchHourlyForecastAPI(lat, lon);
    fetchDailyForecastAPI(lat, lon);
  });

  forecastSuggestionsDropdown.appendChild(newSuggestion);
}

const hourlyTime = {};
const hourlyTemp = {};
const hourlyPrecipitation = {};
const hourlyHumidity = {};
const hourlyPressure = {};
const hourlyUVIndex = {};
const hourlyWindSpeed = {};

const dailyPrecipitation = {};
const dailyTempMax = {};
const dailyTempMin = {};
const dailySunshineDur = {};
const dailyUVIndex = {};
const dailyWindSpeed = {};

let tempChart = null;
let precipChart = null;
let humidityChart = null;
let pressureChart = null;
let uvChart = null;
let windChart = null;

let dailyPrecipChart = null;
let dailyTempMaxChart = null;
let dailyTempMinChart = null;
let dailySunshineChart = null;
let dailyUvChart = null;
let dailyWindChart = null;

async function fetchDailyForecastAPI(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,uv_index_max,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,sunshine_duration`,
  );
  const data = await response.json();

  const dailyLabels = data.daily.time.map((t) => {
    const d = new Date(t);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  });

  dailyPrecipitation["precipitation"] = data.daily.precipitation_sum;
  dailyTempMax["tempMax"] = data.daily.temperature_2m_max;
  dailyTempMin["tempMin"] = data.daily.temperature_2m_min;
  dailySunshineDur["sunshine"] = data.daily.sunshine_duration.map(
    (s) => +(s / 3600).toFixed(1),
  );
  dailyUVIndex["uv"] = data.daily.uv_index_max;
  dailyWindSpeed["windSpeed"] = data.daily.wind_speed_10m_max;

  if (dailyPrecipChart) dailyPrecipChart.destroy();
  if (dailyTempMaxChart) dailyTempMaxChart.destroy();
  if (dailyTempMinChart) dailyTempMinChart.destroy();
  if (dailySunshineChart) dailySunshineChart.destroy();
  if (dailyUvChart) dailyUvChart.destroy();
  if (dailyWindChart) dailyWindChart.destroy();

  dailyPrecipChart = renderDailyChart(
    dailyPrecipitationCtx,
    dailyLabels,
    dailyPrecipitation["precipitation"],
    "Precipitation (mm)",
    "#4dabf7",
  );
  dailyTempMaxChart = renderDailyChart(
    dailyTempMaxCtx,
    dailyLabels,
    dailyTempMax["tempMax"],
    "Max Temperature (°C)",
    "#ff6b6b",
  );
  dailyTempMinChart = renderDailyChart(
    dailyTempMinCtx,
    dailyLabels,
    dailyTempMin["tempMin"],
    "Min Temperature (°C)",
    "#74c0fc",
  );
  dailySunshineChart = renderDailyChart(
    dailySunshineDurationCtx,
    dailyLabels,
    dailySunshineDur["sunshine"],
    "Sunshine Duration (hrs)",
    "#ffd43b",
  );
  dailyUvChart = renderDailyChart(
    dailyUvCtx,
    dailyLabels,
    dailyUVIndex["uv"],
    "UV Index Max",
    "#f783ac",
  );
  dailyWindChart = renderDailyChart(
    dailyWindSpeedCtx,
    dailyLabels,
    dailyWindSpeed["windSpeed"],
    "Max Wind Speed (km/hr)",
    "#94d82d",
  );
}

async function fetchHourlyForecastAPI(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,pressure_msl,uv_index,wind_speed_10m&forecast_days=1`,
  );
  const data = await response.json();

  hourlyTime["time"] = data.hourly.time
    .slice(0, 24)
    .map((t) => new Date(t).getHours() + ":00");
  hourlyTemp["temp"] = data.hourly.temperature_2m.slice(0, 24);
  hourlyPrecipitation["precipitation"] = data.hourly.precipitation.slice(0, 24);
  hourlyHumidity["humidity"] = data.hourly.relative_humidity_2m.slice(0, 24);
  hourlyPressure["pressure"] = data.hourly.pressure_msl
    .slice(0, 24)
    .map((p) => p / 100);
  hourlyUVIndex["uv"] = data.hourly.uv_index.slice(0, 24);
  hourlyWindSpeed["windSpeed"] = data.hourly.wind_speed_10m.slice(0, 24);

  if (tempChart) tempChart.destroy();
  if (precipChart) precipChart.destroy();
  if (humidityChart) humidityChart.destroy();
  if (pressureChart) pressureChart.destroy();
  if (uvChart) uvChart.destroy();
  if (windChart) windChart.destroy();

  tempChart = renderHourlyChart(
    hourlyTempCtx,
    hourlyTemp["temp"],
    "Temperature (°C)",
    "#ff6b6b",
  );
  precipChart = renderHourlyChart(
    hourlyPrecipitationCtx,
    hourlyPrecipitation["precipitation"],
    "Precipitation (mm)",
    "#4dabf7",
  );
  humidityChart = renderHourlyChart(
    hourlyHumidityCtx,
    hourlyHumidity["humidity"],
    "Relative Humidity (%)",
    "#20c997",
  );
  pressureChart = renderHourlyChart(
    hourlyPressureCtx,
    hourlyPressure["pressure"],
    "Pressure (hPa)",
    "#ffd43b",
  );
  uvChart = renderHourlyChart(
    hourlyUVCtx,
    hourlyUVIndex["uv"],
    "UV Index",
    "#f783ac",
  );
  windChart = renderHourlyChart(
    hourlyWindSpeedCtx,
    hourlyWindSpeed["windSpeed"],
    "Wind Speed (km/hr)",
    "#94d82d",
  );

  hourlyMain.classList.remove("hidden");
  document.querySelector(".daily-forecast-text").classList.remove("hidden");
  document.querySelector(".forecast-text").classList.remove("hidden");
  document.querySelector(".daily-main").classList.remove("hidden");
}

function renderHourlyChart(ctx, dataType, label, borderColor) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: hourlyTime["time"],
      datasets: [
        {
          label: label,
          data: dataType,
          borderColor: borderColor,
          backgroundColor: borderColor + "20",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: "#888ea8",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#888ea8",
          },
        },
        y: {
          ticks: {
            color: "#888ea8",
          },
        },
      },
    },
  });
}

function renderDailyChart(ctx, labels, dataType, label, borderColor) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: dataType,
          borderColor: borderColor,
          backgroundColor: borderColor + "20",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: "#888ea8",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#888ea8",
          },
        },
        y: {
          ticks: {
            color: "#888ea8",
          },
        },
      },
    },
  });
}

function weatherMap() {
  const map = L.map("weather-map", {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  ).addTo(map);
}

fetchHourlyForecastAPI(51.5074, -0.1278);
fetchDailyForecastAPI(51.5074, -0.1278);
