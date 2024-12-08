function refreshWeather(response) {
  const temperatureElement = document.querySelector("#temperature");
  const cityElement = document.querySelector("#city");
  const descriptionElement = document.querySelector("#description");
  const humidityElement = document.querySelector("#humidity");
  const windSpeedElement = document.querySelector("#wind-speed");
  const timeElement = document.querySelector("#time");
  const iconElement = document.querySelector("#icon");

  const temperature = Math.round(response.data.temperature.current);
  const city = response.data.city;
  const description = response.data.condition.description;
  const humidity = `${response.data.temperature.humidity}%`;
  const windSpeed = `${response.data.wind.speed} km/h`;
  const iconUrl = response.data.condition.icon_url;
  const date = new Date(response.data.time * 1000);

  cityElement.textContent = city;
  timeElement.textContent = formatDate(date);
  descriptionElement.textContent = description;
  humidityElement.textContent = humidity;
  windSpeedElement.textContent = windSpeed;
  temperatureElement.textContent = temperature;
  iconElement.innerHTML = `<img src="${iconUrl}" class="weather-app-icon" alt="${description}" />`;

  getForecast(city);
}

function formatDate(date) {
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  const apiKey = "b2a5adcct04b33178913oc335f405433";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather).catch(handleError);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  const searchInput = document.querySelector("#search-input");
  const city = searchInput.value.trim();

  if (city) {
    searchCity(city);
  } else {
    alert("Please enter a city name.");
  }
}

function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  const apiKey = "b2a5adcct04b33178913oc335f405433";
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast).catch(handleError);
}

function displayForecast(response) {
  const forecastContainer = document.querySelector("#forecast");
  const dailyForecasts = response.data.daily.slice(0, 5); // Limit to 5 days
  const forecastHtml = dailyForecasts
    .map((day) => {
      return `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <img src="${
            day.condition.icon_url
          }" class="weather-forecast-icon" alt="${day.condition.description}" />
          <div class="weather-forecast-temperatures">
            <div class="weather-forecast-temperature">
              <strong>${Math.round(day.temperature.maximum)}º</strong>
            </div>
            <div class="weather-forecast-temperature">${Math.round(
              day.temperature.minimum
            )}º</div>
          </div>
        </div>
      `;
    })
    .join("");

  forecastContainer.innerHTML = forecastHtml;
}

function handleError(error) {
  console.error("Error fetching weather data:", error);
  alert("Unable to fetch weather data. Please try again later.");
}

// Event Listeners
document
  .querySelector("#search-form")
  .addEventListener("submit", handleSearchSubmit);

// Initialize with a default city
searchCity("Paris");
