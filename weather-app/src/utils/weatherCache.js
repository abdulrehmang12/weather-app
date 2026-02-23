const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export const getCachedWeather = (city, unit) => {
  const cacheKey = `weather_${city.toLowerCase()}_${unit}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    const now = new Date().getTime();
    
    if (now - timestamp < CACHE_DURATION) {
      return data;
    } else {
      localStorage.removeItem(cacheKey);
    }
  }
  
  return null;
};

export const setCachedWeather = (city, unit, data) => {
  const cacheKey = `weather_${city.toLowerCase()}_${unit}`;
  const cacheData = {
    data,
    timestamp: new Date().getTime()
  };
  
  localStorage.setItem(cacheKey, JSON.stringify(cacheData));
};