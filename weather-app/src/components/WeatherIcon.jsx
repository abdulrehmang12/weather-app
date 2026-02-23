import React from 'react';
import './WeatherIcon.css';

function WeatherIcon({ condition }) {
  const getIconClass = () => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'fas fa-sun sunny';
      case 'clouds':
        return 'fas fa-cloud-sun cloudy';
      case 'rain':
      case 'drizzle':
        return 'fas fa-cloud-rain rainy';
      case 'thunderstorm':
        return 'fas fa-bolt thunderstorm';
      case 'snow':
        return 'fas fa-snowflake snowy';
      case 'mist':
      case 'fog':
        return 'fas fa-smog misty';
      default:
        return 'fas fa-cloud';
    }
  };

  return (
    <div className="weather-icon-container">
      <i className={`weather-icon ${getIconClass()}`}></i>
      {condition === 'rain' && (
        <div className="rain-animation">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="raindrop" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random()}s`
            }}></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherIcon;