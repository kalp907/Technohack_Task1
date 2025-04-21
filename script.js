const apiKey = '934f24e35c616bda445d625dce5dd5d2'; // Updated API Key

const cityInput = document.getElementById('cityInput');
const fetchWeatherButton = document.getElementById('fetchWeather');
const weatherContainer = document.getElementById('weather');
const weatherData = document.getElementById('weatherData');
const cityNameEl = document.getElementById('cityName');
const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loading');

fetchWeatherButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!city) {
        errorMessage.classList.remove('hidden');
        return;
    }
    errorMessage.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
    getWeatherData(city);
});

async function getWeatherData(city) {
    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        if (!geoData.length) {
            throw new Error('City not found');
        }

        const { lat, lon } = geoData[0];
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod !== 200) {
            throw new Error(data.message);
        }
        
        loadingIndicator.classList.add('hidden');
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        errorMessage.textContent = 'City not found, please try again.';
        errorMessage.classList.remove('hidden');
        loadingIndicator.classList.add('hidden');
    }
}

function displayWeather(data) {
    weatherContainer.classList.remove('hidden');
    cityNameEl.textContent = `Current Weather in ${data.name}`;
    weatherData.innerHTML = `
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Condition: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}
