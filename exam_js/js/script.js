const tabs = document.querySelectorAll(".tab");
const todayPart = document.querySelector(".today-part");
const forecastPart = document.querySelector(".forecast-part");
const popularCities = document.querySelectorAll(".popular-cities button");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const apiKey = "4eb3703790b356562054106543b748b2";

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab.active").classList.remove("active");
    tab.classList.add("active");

    if (tab.classList.contains("today-tab")) {
      todayPart.classList.add("active");
      forecastPart.classList.remove("active");
    } else {
      forecastPart.classList.add("active");
      todayPart.classList.remove("active");
      loadForecast("Astana");
    }
  });
});

function loadToday(city = "Astana") {
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetch(api).then(res => res.json()).then(data => {
    document.querySelector(".current-date").innerText = new Date().toLocaleDateString();
    document.querySelector(".description").innerText = data.weather[0].description;
    document.querySelector(".numb").innerText = Math.floor(data.main.temp);
    document.querySelector(".feels-like").innerText = Math.floor(data.main.feels_like);
    document.querySelector(".sunrise").innerText = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.querySelector(".sunset").innerText = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const dayLength = data.sys.sunset - data.sys.sunrise;
    document.querySelector(".day-length").innerText = new Date(dayLength * 1000).toISOString().substr(11, 8);
  }).catch(() => alert("City not found!"));
}

function loadForecast(city = "Astana") {
  const api = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  fetch(api).then(res => res.json()).then(data => {
    const forecastCards = document.querySelector(".forecast-cards");
    forecastCards.innerHTML = "";

    data.list.forEach((item, index) => {
      if (index % 8 === 0) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.svg" alt="">
          <p>${item.weather[0].description}</p> 
          <p>${Math.floor(item.main.temp)}°C</p>
        `;
        card.addEventListener("click", () => showDetails(item));
        forecastCards.appendChild(card);
      }
    });
  });
}

function showDetails(data) {
  const details = document.querySelector(".forecast-details");
  details.innerHTML = `
    <p>Wind: ${data.wind.speed} m/s</p>
    <p>Pressure: ${data.main.pressure} hPa</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
    <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
  `;
  details.style.display = "block";
}

popularCities.forEach(cityBtn => {
  cityBtn.addEventListener("click", () => {
    const city = cityBtn.dataset.city;
    loadToday(city);
  });
});

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    loadToday(city);
    loadForecast(city);
  } else {
    alert("Please enter a city name");
  }
});

loadToday();
