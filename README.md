# 🌤️ SkyPulse — Modern Real-Time Weather Dashboard

A sleek, responsive, and feature-rich weather dashboard built with **HTML5, Vanilla CSS3 (Glassmorphism), and Vanilla JavaScript (ES6+)**. Powered by the WeatherAPI, it delivers real-time weather metrics, dynamic atmospheric themes, 24-hour hourly timeline, 3-day forecast, Air Quality Index (AQI), and smart location search.

---

## ✨ Features

- 💎 **Glassmorphic UI**: Translucent frosted-glass cards, subtle light borders, and ambient glow effects.
- 🎨 **Dynamic Atmospheric Theming**: Real-time ambient gradient shifts matching current weather conditions (Clear Day/Night, Rain, Clouds, Snow, Thunderstorm).
- 🌡️ **Comprehensive Weather Metrics**:
  - **Live Temperature & "Feels Like"**
  - **High & Low Forecast for Today**
  - **Air Quality Index (AQI)**: US-EPA index with PM2.5 and PM10 breakdown
  - **Wind Status**: Speed, direction compass, and cardinal orientation
  - **Humidity**: Moisture percentage and comfort level indication
  - **UV Index**: Exposure index with protective advice badges
  - **Visibility & Pressure**: Visual indicators for clarity and barometric pressure
  - **Sun & Moon Astronomy**: Exact sunrise and sunset times
- ⏱️ **24-Hour Hourly Timeline**: Scrollable forecast with hourly temperature and precipitation probability.
- 📅 **3-Day Extended Forecast**: Daily overview with weather icons, min/max ranges, and descriptions.
- 🔄 **Instant Unit Switcher**: Toggle seamlessly between Metric (**°C, km/h, km**) and Imperial (**°F, mph, mi**) without redundant API re-fetching.
- 🌍 **Global City Search & Quick Chips**: Search any city worldwide with instant autocomplete chips (New Delhi, Mumbai, London, New York, Tokyo, etc.).
- 📍 **GPS Geolocation**: One-click "My Location" to fetch weather for your exact coordinates.
- 💾 **Persistent Settings**: Saves your preferred units and last-viewed city in `localStorage`.
- 📱 **Fully Responsive**: Optimized for ultra-wide screens, laptops, tablets, and smartphones.

---

## 🛠️ Tech Stack

- **Markup**: Semantic HTML5 with SEO meta tags
- **Styling**: Vanilla CSS3 (Custom Properties, Flexbox, CSS Grid, Glassmorphism, Keyframe Animations)
- **Scripting**: Vanilla JavaScript (ES6+ Async/Await, Geolocation API, LocalStorage)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Typography**: [Google Fonts](https://fonts.google.com/) (`Outfit` & `Plus Jakarta Sans`)
- **API**: [WeatherAPI](https://www.weatherapi.com/) (Forecast & Air Quality)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/rahulkrs9142/Weather-Dashboard.git
cd Weather-Dashboard
```

### 2. Run locally
Since this is a lightweight static web app, you can simply open `index.html` in any modern web browser or serve it using a local dev server:

```bash
# Using Python
python -m http.server 3000

# Or using Node.js (npx serve / live-server)
npx serve .
```

Then open `http://localhost:3000` in your browser.

---

## 👤 Author

**Rahul Kumar**
- GitHub: [@rahulkrs9142](https://github.com/rahulkrs9142)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
