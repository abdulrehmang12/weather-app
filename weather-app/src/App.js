import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { getCachedWeather, setCachedWeather } from './utils/weatherCache';
import axios from 'axios';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = getCachedWeather(city, unit);
      if (cached) {
        setWeatherData(cached);
        setLoading(false);
        return;
      }

      console.log('Fetching weather for:', city);
      console.log('API Key:', API_KEY);
      
      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          units: unit,
          appid: API_KEY
        }
      });

      console.log('Response data:', response.data);
      
      // Cache the response
      setCachedWeather(city, unit, response.data);
      
      setWeatherData(response.data);
    } catch (err) {
      console.error('Full error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        if (err.response.status === 404) {
          setError('City not found. Please try again.');
        } else if (err.response.status === 401) {
          setError('API key error. Please check your API key.');
        } else {
          setError('Failed to fetch weather data. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get user's location on initial load
  useEffect(() => {
    // Default to a major city
    fetchWeather('London');
  }, []);

  const toggleUnit = () => {
    setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
    if (weatherData) {
      fetchWeather(weatherData.name);
    }
  };

  return (
    <div className={`app ${weatherData?.weather[0]?.main?.toLowerCase() || ''}`}>
      <div className="container">
        <h1 className="title">Weather App</h1>
        
        <div className="controls">
          <SearchBar onSearch={fetchWeather} />
          <button onClick={toggleUnit} className="unit-toggle">
            Switch to °{unit === 'metric' ? 'F' : 'C'}
          </button>
        </div>

        {loading && <div className="loading">Loading...</div>}
        
        {error && <div className="error">{error}</div>}
        
        {weatherData && !loading && (
          <WeatherCard data={weatherData} unit={unit} />
        )}
      </div>
    </div>
  );
}

export default App;