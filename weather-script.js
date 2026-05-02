// Weather Dashboard JavaScript

const API_KEY = '64baeac70e58039a2c6501ba8d4b04e1'; // Free OpenWeatherMap API Key
const BASE_URL = 'https://api.openweathermap.org';

// DOM Elements
const searchInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherSection = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');
const forecastContainer = document.getElementById('forecastContainer');
const hourlyForecast = document.getElementById('hourlyForecast');
const hourlyContainer = document.getElementById('hourlyContainer');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
locationBtn.addEventListener('click', handleGeolocation);

// Main Functions

async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    await getWeatherByCity(city);
}

async function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await getWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
            showLoading(false);
            showError('Unable to access your location. Please check permissions.');
        }
    );
}

async function getWeatherByCity(city) {
    try {
        showLoading(true);
        clearError();

        // Get coordinates from city name
        const geoResponse = await fetch(
            `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();

        if (!geoData || geoData.length === 0) {
            showError('City not found. Please try another search.');
            showLoading(false);
            return;
        }

        const { lat, lon } = geoData[0];
        await getWeatherByCoordinates(lat, lon);
    } catch (error) {
        showError('Error fetching weather data. Please try again.');
        console.error('Error:', error);
        showLoading(false);
    }
}

async function getWeatherByCoordinates(lat, lon) {
    try {
        showLoading(true);
        clearError();

        // Fetch current weather
        const currentResponse = await fetch(
            `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const currentData = await currentResponse.json();

        // Fetch forecast
        const forecastResponse = await fetch(
            `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        // Fetch One Call API for hourly data
        const onecallResponse = await fetch(
            `${BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${API_KEY}`
        );
        const onecallData = await onecallResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        displayHourlyForecast(onecallData);

        searchInput.value = '';
        showLoading(false);
    } catch (error) {
        showError('Error fetching weather data. Please try again.');
        console.error('Error:', error);
        showLoading(false);
    }
}

function displayCurrentWeather(data) {
    const {
        name,
        sys,
        main,
        weather,
        wind,
        clouds,
        visibility,
        dt
    } = data;

    const temp = Math.round(main.temp);
    const feelsLike = Math.round(main.feels_like);
    const description = weather[0].main;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Convert sunrise/sunset timestamps to time
    const sunrise = new Date(sys.sunrise * 1000);
    const sunset = new Date(sys.sunset * 1000);
    const sunriseTime = formatTime(sunrise);
    const sunsetTime = formatTime(sunset);

    // Update DOM
    document.getElementById('cityName').textContent = `${name}, ${sys.country}`;
    document.getElementById('temperature').textContent = temp;
    document.getElementById('weatherDescription').textContent = description;
    document.getElementById('feelsLike').textContent = `Feels like: ${feelsLike}°C`;
    document.getElementById('weatherIcon').src = iconUrl;
    
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${(wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById('pressure').textContent = `${main.pressure} mb`;
    document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById('cloudiness').textContent = `${clouds.all}%`;
    
    // UV Index estimation based on clouds and time of day
    const uvIndex = estimateUVIndex(clouds.all, dt);
    document.getElementById('uvIndex').textContent = uvIndex.toFixed(1);
    
    document.getElementById('sunrise').textContent = sunriseTime;
    document.getElementById('sunset').textContent = sunsetTime;

    currentWeatherSection.classList.remove('hidden');
}

function displayForecast(data) {
    const forecastList = data.list;
    const forecastMap = new Map();

    // Group by date (one entry per day at noon)
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();

        if (!forecastMap.has(dateKey)) {
            // Store only one forecast per day
            if (date.getHours() >= 11 && date.getHours() <= 13) {
                forecastMap.set(dateKey, item);
            }
        }
    });

    // Get 5 days of forecast
    const forecasts = Array.from(forecastMap.values()).slice(0, 5);

    forecastContainer.innerHTML = '';
    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateStr = formatDate(date);
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        const maxTemp = Math.round(forecast.main.temp_max);
        const minTemp = Math.round(forecast.main.temp_min);
        const description = forecast.weather[0].main;
        const humidity = forecast.main.humidity;
        const windSpeed = (forecast.wind.speed * 3.6).toFixed(1);

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${dateStr}</div>
            <div class="forecast-icon"><img src="${iconUrl}" alt="${description}"></div>
            <div class="forecast-description">${description}</div>
            <div class="forecast-temp">
                <span>${maxTemp}°</span> / <span>${minTemp}°</span>
            </div>
            <div class="forecast-details">
                <p>💧 ${humidity}%</p>
                <p>💨 ${windSpeed} km/h</p>
            </div>
        `;
        forecastContainer.appendChild(card);
    });

    forecastSection.classList.remove('hidden');
}

function displayHourlyForecast(data) {
    const hourlyList = data.hourly.slice(0, 8); // Next 24 hours (3-hour intervals)

    hourlyContainer.innerHTML = '';
    hourlyList.forEach((hour, index) => {
        const date = new Date(hour.dt * 1000);
        const timeStr = date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
        const temp = Math.round(hour.temp);
        const description = hour.weather[0].main;
        const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;

        const item = document.createElement('div');
        item.className = 'hourly-item';
        item.innerHTML = `
            <div class="hourly-time">${timeStr}</div>
            <div class="hourly-icon"><img src="${iconUrl}" alt="${description}"></div>
            <div class="hourly-temp">${temp}°C</div>
        `;
        hourlyContainer.appendChild(item);
    });

    hourlyForecast.classList.remove('hidden');
}

// Helper Functions

function formatTime(date) {
    return date.getHours().toString().padStart(2, '0') + ':' +
           date.getMinutes().toString().padStart(2, '0');
}

function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function estimateUVIndex(cloudiness, dt) {
    // Simple UV index estimation
    // Based on cloud coverage and time of day
    const sunHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const date = new Date(dt * 1000);
    const hour = date.getHours();

    let baseUV = sunHours.includes(hour) ? 8 : 3;
    const cloudFactor = (100 - cloudiness) / 100;
    const uvIndex = baseUV * cloudFactor;

    return Math.max(0, uvIndex);
}

function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

function clearError() {
    errorMessage.classList.remove('show');
}

// Initialize - Show demo weather for London on load
window.addEventListener('load', () => {
    getWeatherByCity('London');
});