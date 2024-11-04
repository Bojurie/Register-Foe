// src/mocks/weatherMockAPI.js

export const mockWeatherData = {
  current: {
    temp: 22.5,
    weather: [
      {
        description: "clear sky",
        icon: "01d", // Change this to test different icons
      },
    ],
  },
  timezone: "America/New_York",
};

// Mock location data
export const mockLocationData = {
  latitude: 40.7128,
  longitude: -74.006,
  city: "New York",
  state: "NY",
  country: "USA",
};
