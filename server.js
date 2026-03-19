const express = require('express');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(express.json());

// Allow requests from the React development server
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean);
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/weather', (req, res) => {
  const { city, units } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const safeUnits = ['metric', 'imperial', 'standard'].includes(units)
    ? units
    : 'metric';
  const encodedCity = encodeURIComponent(city);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=${safeUnits}&appid=${API_KEY}`;

  https
    .get(url, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      apiRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          res.status(apiRes.statusCode).json(parsed);
        } catch (parseErr) {
          console.error('Failed to parse OpenWeather response:', parseErr.message);
          res.status(500).json({ error: 'Failed to parse weather data' });
        }
      });
    })
    .on('error', (networkErr) => {
      console.error('OpenWeather API request failed:', networkErr.message);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    });
});

app.listen(PORT, () => {
  console.log(`Weather proxy server running on port ${PORT}`);
});
