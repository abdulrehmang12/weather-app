import React from 'react';
import WeatherIcon from './WeatherIcon';
import './WeatherCard.css';

function WeatherCard({ data, unit }) {
  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather,
    wind: { speed },
    sys: { country }
  } = data;

  const weatherCondition = weather[0].main;
  const description = weather[0].description;
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  // Get background gradient based on weather condition
  const getBackgroundClass = () => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        return 'weather-card clear';
      case 'clouds':
        return 'weather-card clouds';
      case 'rain':
      case 'drizzle':
        return 'weather-card rain';
      case 'thunderstorm':
        return 'weather-card thunderstorm';
      case 'snow':
        return 'weather-card snow';
      case 'mist':
      case 'fog':
        return 'weather-card mist';
      default:
        return 'weather-card';
    }
  };

  return (
    <div className={getBackgroundClass()}>
      <div className="weather-header">
        <h2>{name}, {country}</h2>
        <WeatherIcon condition={weatherCondition} />
      </div>
      
      <div className="temperature">
        {Math.round(temp)}{tempUnit}
      </div>
      
      <div className="description">
        {description}
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">{Math.round(feels_like)}{tempUnit}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{speed} {windUnit}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{pressure} hPa</span>
        </div>
      </div>

      <div className="last-updated">
        Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}

export default WeatherCard;