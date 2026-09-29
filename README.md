<div align="center">

# 🌤️ SkyPulse — Real-Time Weather Dashboard

[![GitHub stars](https://img.shields.io/github/stars/rahulkrs9142/Weather-Dashboard?style=for-the-badge&color=38bdf8)](https://github.com/rahulkrs9142/Weather-Dashboard/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/rahulkrs9142/Weather-Dashboard?style=for-the-badge&color=818cf8)](https://github.com/rahulkrs9142/Weather-Dashboard/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-34d399.svg?style=for-the-badge)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-6.2+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

<p align="center">
  A sleek, ultra-responsive, and modern weather dashboard crafted with <b>Vanilla HTML5, CSS3 Glassmorphism, and ES6+ JavaScript</b>. Powered by the <b>WeatherAPI</b>, SkyPulse delivers real-time weather metrics, dynamic atmospheric themes, 24-hour hourly timelines, 3-day forecast models, and Air Quality Index (AQI) tracking.
</p>

[Explore Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [File Structure](#-project-structure) • [Author](#-author)

</div>

---

## 📸 Overview

SkyPulse provides an intuitive, high-performance interface designed for quick weather insights and detailed atmospheric analytics across any device:

- 🔮 **Adaptive Glassmorphic Interface**: Deep dark-mode aesthetic with frosted glass layers, neon ambient gradients, and smooth state transitions.
- 🎨 **Context-Aware Atmospheric Theming**: The background ambient aura dynamically changes to match current conditions:
  - ☀️ *Clear / Sunny Day*
  - 🌙 *Starry / Clear Night*
  - 🌧️ *Rain / Drizzle*
  - ☁️ *Overcast / Clouds*
  - ❄️ *Snow / Blizzard*
  - ⚡ *Thunderstorm / Severe Weather*

---

## ✨ Features

### 🌡️ Detailed Weather Analytics
- **Live Temp & "Feels Like"**: Accurate temperature display with high and low bounds for the day.
- **Air Quality Index (AQI)**: Real-time US-EPA standard AQI calculation accompanied by individual PM2.5 and PM10 breakdown.
- **Wind Velocity & Direction**: Real-time wind speed, cardinal direction, and an interactive compass orientation indicator.
- **Humidity & Dew Point**: Moisture levels paired with comfort rating indicators.
- **UV Index Meter**: Daily UV index with real-time health and skin protection advisory tags.
- **Pressure & Visibility**: Atmospheric pressure in `hPa / inHg` and line-of-sight visibility in `km / miles`.
- **Astronomical Timeline**: Accurate sunrise and sunset timings.

### ⏱️ Hourly & Extended Forecasts
- **24-Hour Timeline Strip**: Horizontally scrollable timeline featuring hourly temperature progression, weather icons, and chance of precipitation.
- **3-Day Forecast Cards**: Daily overview highlighting weather icons, temperature range bands (min/max), and weather status summaries.

### ⚡ Smart Search & Geolocation
- **Global City Search**: Search any city, town, or region across the world with instant query processing.
- **Popular City Quick Chips**: One-tap access to global hubs (*New Delhi, Mumbai, London, New York, Tokyo, Paris, Sydney, Dubai*).
- **GPS "My Location"**: High-accuracy geolocation detection for immediate local weather.
- **Dual Unit Switcher**: Instant toggle between Metric (**°C, km/h, km**) and Imperial (**°F, mph, mi**) without unnecessary API re-fetching.
- **Persistent Preferences**: Local storage saves your preferred measurement units and last-searched location across sessions.

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **HTML5** | Semantic structure, accessibility (`aria-labels`), and SEO meta tags |
| **Vanilla CSS3** | Custom CSS properties, CSS Grid & Flexbox, Backdrop-filter glassmorphism, fluid responsive typography, and micro-animations |
| **JavaScript (ES6+)** | Asynchronous API integration (`fetch`), Geolocation API, LocalStorage persistence, DOM event delegation |
| **Vite** | Blazing-fast local development server and optimized static bundling |
| **Phosphor Icons** | Clean, lightweight icon suite for weather metrics and UI navigation |
| **Google Fonts** | `Outfit` (headings & numbers) and `Plus Jakarta Sans` (body & metrics) |
| **WeatherAPI** | Real-time weather, astronomy, hourly timeline, and air quality dataset |

---

## 📁 Project Structure

```text
Weather-Dashboard/
├── index.html            # Main HTML document with semantic dashboard layout
├── style.css             # Glassmorphism styling, ambient glow animations & responsive rules
├── script.js             # Core application logic, API integration & DOM manipulation
├── package.json          # Node configuration & Vite development scripts
├── dist/                 # Production-ready build artifacts
├── tools/                # Deployment and utility scripts
├── .gitignore            # Git exclusion rules
└── README.md             # Project documentation
```

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/rahulkrs9142/Weather-Dashboard.git
cd Weather-Dashboard
```

### 2. Run Locally

#### Option A: Using Vite (Recommended)
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:3030` (or the URL displayed in your terminal) in your browser.

#### Option B: Using Simple Static Server
Since SkyPulse is built with pure Vanilla JavaScript, HTML, and CSS, you can also run it with any static server:

```bash
# Using Python 3
python -m http.server 3000

# Or using npx serve
npx serve .
```

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🔑 API Configuration

SkyPulse connects to [WeatherAPI.com](https://www.weatherapi.com/).

If you wish to use your own API key:
1. Register for a free API key at [WeatherAPI](https://www.weatherapi.com/).
2. Open [script.js](file:///e:/Weather%20Dasboard/script.js) and update the `API_KEY` constant:
   ```javascript
   const API_KEY = 'YOUR_WEATHERAPI_KEY_HERE';
   ```

---

## 📱 Responsiveness

SkyPulse is engineered to be fully responsive across all device breakpoints:
- 💻 **Desktops & Ultrawide Displays** (1200px+)
- 💻 **Laptops & Notebooks** (992px - 1199px)
- 📱 **Tablets & iPads** (768px - 991px)
- 📱 **Smartphones & Foldables** (< 768px)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project (`https://github.com/rahulkrs9142/Weather-Dashboard/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Rahul Kumar**
- GitHub: [@rahulkrs9142](https://github.com/rahulkrs9142)
- Repository: [Weather-Dashboard](https://github.com/rahulkrs9142/Weather-Dashboard)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and adapt it for personal and commercial projects.
