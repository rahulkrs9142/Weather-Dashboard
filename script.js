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
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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

// ==========================================================================
// Highlights Metrics Rendering
// ==========================================================================
function renderHighlights(current, todayForecast, isFahrenheit) {
    // Air Quality Index
    if (current.air_quality) {
        const epaIndex = current.air_quality["us-epa-index"] || 1;
        const aqiInfo = getAQIInfo(epaIndex);
        aqiValEl.textContent = epaIndex;
        aqiStatusEl.textContent = aqiInfo.label;
        aqiStatusEl.className = `metric-badge ${aqiInfo.badgeClass}`;
        
        pm25ValEl.textContent = current.air_quality.pm2_5 ? current.air_quality.pm2_5.toFixed(1) : "--";
        pm10ValEl.textContent = current.air_quality.pm10 ? current.air_quality.pm10.toFixed(1) : "--";
    } else {
        aqiValEl.textContent = "N/A";
        aqiStatusEl.textContent = "Unavailable";
    }

    // Wind Status
    const windSpeed = isFahrenheit ? Math.round(current.wind_mph) : Math.round(current.wind_kph);
    windSpeedEl.textContent = windSpeed;
    windUnitEl.textContent = isFahrenheit ? "mph" : "km/h";
    windDirEl.textContent = current.wind_dir || "N";
    if (current.wind_degree !== undefined) {
        windCompassEl.style.transform = `rotate(${current.wind_degree}deg)`;
        windCompassEl.style.transition = "transform 0.5s ease";
    }

    // Humidity
    humidityValEl.textContent = current.humidity;
    if (current.humidity < 30) {
        humidityDescEl.textContent = "Dry air • Keep hydrated";
    } else if (current.humidity <= 60) {
        humidityDescEl.textContent = "Comfortable • Ideal level";
    } else {
        humidityDescEl.textContent = "High humidity • Feels sticky";
    }

    // UV Index
    const uv = current.uv;
    uvValEl.textContent = uv;
    const uvInfo = getUVInfo(uv);
    uvBadgeEl.textContent = uvInfo.level;
    uvBadgeEl.className = `metric-badge ${uvInfo.badgeClass}`;
    uvDescEl.textContent = uvInfo.advice;

    // Visibility & Pressure
    const vis = isFahrenheit ? current.vis_miles : current.vis_km;
    visValEl.textContent = vis;
    visUnitEl.textContent = isFahrenheit ? "mi" : "km";
    pressureValEl.textContent = current.pressure_mb;

    // Sunrise & Sunset
    if (todayForecast.astro) {
        sunriseTimeEl.textContent = todayForecast.astro.sunrise || "--:--";
        sunsetTimeEl.textContent = todayForecast.astro.sunset || "--:--";
    }
}

// ==========================================================================
// 24-Hour Hourly Timeline
// ==========================================================================
function renderHourlyForecast(forecast, localTimeStr, isFahrenheit) {
    hourlyTrackEl.innerHTML = "";

    const currentHour = new Date(localTimeStr).getHours();
    const todayHours = forecast.forecastday[0].hour || [];
    const tomorrowHours = forecast.forecastday[1]?.hour || [];
    
    // Combine hours starting from current hour up to next 24 hours
    const next24Hours = [];
    
    for (let i = currentHour; i < todayHours.length; i++) {
        next24Hours.push(todayHours[i]);
    }
    for (let i = 0; i < currentHour && i < tomorrowHours.length; i++) {
        next24Hours.push(tomorrowHours[i]);
    }

    next24Hours.slice(0, 24).forEach((h, index) => {
        const itemDate = new Date(h.time);
        let timeLabel = itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (index === 0) timeLabel = "Now";

        const temp = isFahrenheit ? Math.round(h.temp_f) : Math.round(h.temp_c);
        const icon = formatIconUrl(h.condition.icon);
        const rainChance = h.chance_of_rain || 0;

        const card = document.createElement("div");
        card.className = `hourly-item ${index === 0 ? 'active' : ''}`;
        card.innerHTML = `
            <span class="hourly-time">${timeLabel}</span>
            <img class="hourly-icon" src="${icon}" alt="${h.condition.text}" loading="lazy" />
            <span class="hourly-temp">${temp}°</span>
            <span class="hourly-rain"><i class="ph ph-drop"></i> ${rainChance}%</span>
        `;
        hourlyTrackEl.appendChild(card);
    });
}

// ==========================================================================
// 3-Day Daily Forecast
// ==========================================================================
function renderDailyForecast(forecastDays, isFahrenheit) {
    forecastListEl.innerHTML = "";

    forecastDays.forEach((fDay, index) => {
        const dateObj = new Date(fDay.date + "T00:00:00");
        let dayName;
        if (index === 0) {
            dayName = "Today";
        } else if (index === 1) {
            dayName = "Tomorrow";
        } else {
            dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        }

        const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const max = isFahrenheit ? Math.round(fDay.day.maxtemp_f) : Math.round(fDay.day.maxtemp_c);
        const min = isFahrenheit ? Math.round(fDay.day.mintemp_f) : Math.round(fDay.day.mintemp_c);
        const icon = formatIconUrl(fDay.day.condition.icon);
        const condition = fDay.day.condition.text;

        const row = document.createElement("div");
        row.className = "forecast-item";
        row.innerHTML = `
            <div class="forecast-day-info">
                <span class="forecast-day-name">${dayName}</span>
                <span class="forecast-date">${dateStr}</span>
            </div>
            <img class="forecast-icon" src="${icon}" alt="${condition}" loading="lazy" />
            <span class="forecast-condition" title="${condition}">${condition}</span>
            <div class="forecast-temps">
                <span class="temp-max-val">${max}°</span>
                <span class="temp-min-val">${min}°</span>
            </div>
        `;
        forecastListEl.appendChild(row);
    });
}

// ==========================================================================
// Helper Utilities
// ==========================================================================
function formatDateTime(localTimeStr) {
    if (!localTimeStr) return;
    const date = new Date(localTimeStr.replace(/-/g, "/"));
    
    // Time formatted HH:MM
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    localTimeEl.textContent = `${hours}:${minutes}`;

    // Date formatted e.g. "Monday, 12 May 2026"
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    localDateEl.textContent = date.toLocaleDateString('en-US', options);
}

function formatIconUrl(url) {
    if (!url) return "";
    let clean = url.startsWith("//") ? `https:${url}` : url;
    // Upgrade icon resolution from 64x64 to 128x128 for crisp display
    return clean.replace("64x64", "128x128");
}

function getAQIInfo(index) {
    switch(index) {
        case 1:
            return { label: "Good", badgeClass: "badge-good" };
        case 2:
            return { label: "Moderate", badgeClass: "badge-moderate" };
        case 3:
            return { label: "Unhealthy for Sensitive", badgeClass: "badge-moderate" };
        case 4:
            return { label: "Unhealthy", badgeClass: "badge-unhealthy" };
        case 5:
            return { label: "Very Unhealthy", badgeClass: "badge-unhealthy" };
        case 6:
            return { label: "Hazardous", badgeClass: "badge-unhealthy" };
        default:
            return { label: "Moderate", badgeClass: "badge-moderate" };
    }
}

function getUVInfo(uv) {
    if (uv <= 2) {
        return { level: "Low", advice: "Minimal protection required", badgeClass: "badge-good" };
    } else if (uv <= 5) {
        return { level: "Moderate", advice: "Stay in shade during midday", badgeClass: "badge-moderate" };
    } else if (uv <= 7) {
        return { level: "High", advice: "Wear sunscreen & sunglasses", badgeClass: "badge-unhealthy" };
    } else if (uv <= 10) {
        return { level: "Very High", advice: "Avoid mid-day sun exposure", badgeClass: "badge-unhealthy" };
    } else {
        return { level: "Extreme", advice: "Take full protective measures", badgeClass: "badge-unhealthy" };
    }
}

function updateActiveChip(cityName) {
    const target = cityName.toLowerCase();
    cityChips.forEach(chip => {
        const chipCity = chip.getAttribute("data-city").toLowerCase();
        if (target.includes(chipCity) || chipCity.includes(target)) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingOverlay.classList.add("active");
        loadingOverlay.setAttribute("aria-hidden", "false");
    } else {
        loadingOverlay.classList.remove("active");
        loadingOverlay.setAttribute("aria-hidden", "true");
    }
}

let toastTimeout = null;
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}