/**
 * SkyPulse Weather Dashboard - Application Logic
 * Modern, responsive, real-time weather tracking with WeatherAPI
 */

const API_KEY = "904655097eda4ec898c192225261105";
const DEFAULT_CITY = "New Delhi";

// State Management
let currentData = null;
let currentUnit = localStorage.getItem("skypulse_unit") || "c"; // 'c' or 'f'

// DOM Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search-btn");
const geoBtn = document.getElementById("geo-btn");
const unitButtons = document.querySelectorAll(".unit-btn");
const cityChips = document.querySelectorAll(".city-chip");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
const loadingOverlay = document.getElementById("loading-overlay");

// Weather Display Elements
const cityNameEl = document.getElementById("city-name");
const locationTextEl = document.getElementById("location-text");
const localTimeEl = document.getElementById("local-time");
const localDateEl = document.getElementById("local-date");
const currentTempEl = document.getElementById("current-temp");
const weatherIconEl = document.getElementById("weather-icon");
const conditionTextEl = document.getElementById("condition-text");
const tempMaxEl = document.getElementById("temp-max");
const tempMinEl = document.getElementById("temp-min");
const feelsLikeTempEl = document.getElementById("feels-like-temp");

// Metric Highlight Elements
const aqiValEl = document.getElementById("aqi-val");
const aqiStatusEl = document.getElementById("aqi-status");
const pm25ValEl = document.getElementById("pm25-val");
const pm10ValEl = document.getElementById("pm10-val");
const windSpeedEl = document.getElementById("wind-speed");
const windUnitEl = document.getElementById("wind-unit");
const windDirEl = document.getElementById("wind-dir");
const windCompassEl = document.getElementById("wind-compass");
const humidityValEl = document.getElementById("humidity-val");
const humidityDescEl = document.getElementById("humidity-desc");
const uvValEl = document.getElementById("uv-val");
const uvBadgeEl = document.getElementById("uv-badge");
const uvDescEl = document.getElementById("uv-desc");
const visValEl = document.getElementById("vis-val");
const visUnitEl = document.getElementById("vis-unit");
const pressureValEl = document.getElementById("pressure-val");
const sunriseTimeEl = document.getElementById("sunrise-time");
const sunsetTimeEl = document.getElementById("sunset-time");

// Forecast Containers
const hourlyTrackEl = document.getElementById("hourly-track");
const forecastListEl = document.getElementById("forecast-list");

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initUnitToggle();
    initEventListeners();

    const savedCity = localStorage.getItem("skypulse_city") || DEFAULT_CITY;
    fetchWeatherData(savedCity);
});

// ==========================================================================
// Event Listeners
// ==========================================================================
function initEventListeners() {
    // Search form submission
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            fetchWeatherData(query);
        }
    });

    // Search input clear button visibility
    searchInput.addEventListener("input", () => {
        if (searchInput.value.trim().length > 0) {
            clearSearchBtn.classList.add("visible");
        } else {
            clearSearchBtn.classList.remove("visible");
        }
    });

    // Clear search input
    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearSearchBtn.classList.remove("visible");
        searchInput.focus();
    });

    // Geolocation button
    geoBtn.addEventListener("click", handleGeolocation);

    // Quick City chips
    cityChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const city = chip.getAttribute("data-city");
            searchInput.value = city;
            clearSearchBtn.classList.add("visible");
            fetchWeatherData(city);
        });
    });
}

// ==========================================================================
// Unit Toggle (°C / °F)
// ==========================================================================
function initUnitToggle() {
    unitButtons.forEach(btn => {
        if (btn.getAttribute("data-unit") === currentUnit) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }

        btn.addEventListener("click", () => {
            const newUnit = btn.getAttribute("data-unit");
            if (newUnit !== currentUnit) {
                currentUnit = newUnit;
                localStorage.setItem("skypulse_unit", currentUnit);
                
                unitButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                if (currentData) {
                    renderDashboard(currentData);
                }
            }
        });
    });
}

// ==========================================================================
// Geolocation Handler
// ==========================================================================
function handleGeolocation() {
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser.");
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(`${latitude},${longitude}`);
        },
        (error) => {
            showLoading(false);
            let msg = "Unable to retrieve your location.";
            if (error.code === error.PERMISSION_DENIED) {
                msg = "Location access was denied. Please search manually.";
            }
            showToast(msg);
        },
        { timeout: 10000 }
    );
}

// ==========================================================================
// Data Fetching
// ==========================================================================
async function fetchWeatherData(query) {
    showLoading(true);
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=3&aqi=yes`;
        const res = await fetch(url);
        
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const errMsg = errData.error?.message || "City not found. Please verify spelling.";
            throw new Error(errMsg);
        }

        const data = await res.json();
        currentData = data;
        
        // Save successfully loaded city
        localStorage.setItem("skypulse_city", data.location.name);

        renderDashboard(data);
        updateActiveChip(data.location.name);
    } catch (err) {
        console.error("Fetch weather error:", err);
        showToast(err.message || "Failed to load weather data.");
    } finally {
        showLoading(false);
    }
}

// ==========================================================================
// Render Dashboard
// ==========================================================================
function renderDashboard(data) {
    const { location, current, forecast } = data;
    const isFahrenheit = currentUnit === "f";

    // 1. Theme and Atmospheric Background
    applyDynamicTheme(current.condition.text, current.is_day);

    // 2. Header & Location Details
    cityNameEl.textContent = location.name;
    locationTextEl.textContent = `${location.region ? location.region + ', ' : ''}${location.country}`;

    // Format local time and date
    formatDateTime(location.localtime);

    // 3. Main Temperature & Hero Display
    const tempVal = isFahrenheit ? Math.round(current.temp_f) : Math.round(current.temp_c);
    const feelsVal = isFahrenheit ? Math.round(current.feelslike_f) : Math.round(current.feelslike_c);
    
    currentTempEl.textContent = `${tempVal}°`;
    feelsLikeTempEl.textContent = `${feelsVal}°${currentUnit.toUpperCase()}`;

    // Condition & High/Low from today's forecast
    const todayForecast = forecast.forecastday[0].day;
    const maxTemp = isFahrenheit ? Math.round(todayForecast.maxtemp_f) : Math.round(todayForecast.maxtemp_c);
    const minTemp = isFahrenheit ? Math.round(todayForecast.mintemp_f) : Math.round(todayForecast.mintemp_c);

    tempMaxEl.textContent = `${maxTemp}°`;
    tempMinEl.textContent = `${minTemp}°`;
    conditionTextEl.textContent = current.condition.text;

    // High resolution condition icon
    const secureIcon = formatIconUrl(current.condition.icon);
    weatherIconEl.src = secureIcon;
    weatherIconEl.alt = current.condition.text;

    // 4. Highlight Metrics
    renderHighlights(current, forecast.forecastday[0], isFahrenheit);

    // 5. Hourly Forecast (Next 24 Hours)
    renderHourlyForecast(forecast, location.localtime, isFahrenheit);

    // 6. 3-Day Forecast
    renderDailyForecast(forecast.forecastday, isFahrenheit);
}

// ==========================================================================
// Atmospheric Dynamic Theming
// ==========================================================================
function applyDynamicTheme(conditionText, isDay) {
    const text = conditionText.toLowerCase();
    const body = document.body;

    // Remove all previous theme classes
    body.className = body.className
        .split(" ")
        .filter(c => !c.startsWith("theme-"))
        .join(" ");

    if (text.includes("thunder") || text.includes("lightning")) {
        body.classList.add("theme-thunder");
    } else if (text.includes("snow") || text.includes("ice") || text.includes("blizzard") || text.includes("sleet")) {
        body.classList.add("theme-snow");
    } else if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) {
        body.classList.add("theme-rainy");
    } else if (text.includes("cloud") || text.includes("overcast") || text.includes("mist") || text.includes("fog")) {
        body.classList.add("theme-cloudy");
    } else if (text.includes("sunny") || text.includes("clear")) {
        body.classList.add(isDay ? "theme-clear-day" : "theme-clear-night");
    } else {
        body.classList.add("theme-default");
    }
}

// Helper Utilities
function formatDateTime(localTimeStr) {
    if (!localTimeStr) return { time: "--:--", date: "--" };
    const dateObj = new Date(localTimeStr.replace(" ", "T"));
    if (isNaN(dateObj.getTime())) {
        const parts = localTimeStr.split(" ");
        return { time: parts[1] || "--:--", date: parts[0] || "--" };
    }
    const timeFormatted = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
    const dateFormatted = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
    return { time: timeFormatted, date: dateFormatted };
}

let toastTimeout = null;
function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("show");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}

function setLoading(isLoading) {
    if (!loadingOverlay) return;
    if (isLoading) {
        loadingOverlay.classList.add("active");
        loadingOverlay.setAttribute("aria-hidden", "false");
    } else {
        loadingOverlay.classList.remove("active");
        loadingOverlay.setAttribute("aria-hidden", "true");
    }
}
