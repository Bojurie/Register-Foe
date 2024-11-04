// src/mocks/weatherMockAPI.js

export const mockWeatherData = {
  locations: {
    "New York": {
      current: {
        temp: 22.5,
        weather: [
          {
            description: "clear sky",
            icon: "01d",
          },
        ],
      },
      timezone: "America/New_York",
    },
    "Los Angeles": {
      current: {
        temp: 25.0,
        weather: [
          {
            description: "sunny",
            icon: "01d",
          },
        ],
      },
      timezone: "America/Los_Angeles",
    },
    Chicago: {
      current: {
        temp: 15.0,
        weather: [
          {
            description: "cloudy",
            icon: "03d",
          },
        ],
      },
      timezone: "America/Chicago",
    },
    Miami: {
      current: {
        temp: 28.0,
        weather: [
          {
            description: "thunderstorms",
            icon: "11d",
          },
        ],
      },
      timezone: "America/New_York",
    },
    Seattle: {
      current: {
        temp: 18.0,
        weather: [
          {
            description: "rain",
            icon: "10d",
          },
        ],
      },
      timezone: "America/Los_Angeles",
    },
    Denver: {
      current: {
        temp: 12.0,
        weather: [
          {
            description: "snow",
            icon: "13d",
          },
        ],
      },
      timezone: "America/Denver",
    },
  },
};

// Function to get weather data based on city
export const getWeatherData = (city) => {
  return mockWeatherData.locations[city] || null;
};

// Mock location data (You can extend this as needed)
export const mockLocationData = {
  "New York": {
    latitude: 40.7128,
    longitude: -74.006,
    city: "New York",
    state: "NY",
    country: "USA",
  },
  "Los Angeles": {
    latitude: 34.0522,
    longitude: -118.2437,
    city: "Los Angeles",
    state: "CA",
    country: "USA",
  },
  Chicago: {
    latitude: 41.8781,
    longitude: -87.6298,
    city: "Chicago",
    state: "IL",
    country: "USA",
  },
  Miami: {
    latitude: 25.7617,
    longitude: -80.1918,
    city: "Miami",
    state: "FL",
    country: "USA",
  },
  Seattle: {
    latitude: 47.6062,
    longitude: -122.3321,
    city: "Seattle",
    state: "WA",
    country: "USA",
  },
  Denver: {
    latitude: 39.7392,
    longitude: -104.9903,
    city: "Denver",
    state: "CO",
    country: "USA",
  },
};
