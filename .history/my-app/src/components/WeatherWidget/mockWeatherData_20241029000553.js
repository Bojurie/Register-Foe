// src/mocks/weatherMockAPI.js

const mockWeatherData = {
  NewYork: {
    current: {
      temp: 22,
      weather: [
        {
          description: "clear sky",
          icon: "01d",
        },
      ],
    },
    timezone: "America/New_York",
  },
  LosAngeles: {
    current: {
      temp: 28,
      weather: [
        {
          description: "few clouds",
          icon: "02d",
        },
      ],
    },
    timezone: "America/Los_Angeles",
  },
  Chicago: {
    current: {
      temp: 15,
      weather: [
        {
          description: "light rain",
          icon: "10d",
        },
      ],
    },
    timezone: "America/Chicago",
  },
  London: {
    current: {
      temp: 10,
      weather: [
        {
          description: "overcast clouds",
          icon: "04d",
        },
      ],
    },
    timezone: "Europe/London",
  },
  Tokyo: {
    current: {
      temp: 18,
      weather: [
        {
          description: "clear sky",
          icon: "01d",
        },
      ],
    },
    timezone: "Asia/Tokyo",
  },
};

export const mockLocationData = {
  NewYork: { city: "New York", state: "NY", country: "USA" },
  LosAngeles: { city: "Los Angeles", state: "CA", country: "USA" },
  Chicago: { city: "Chicago", state: "IL", country: "USA" },
  London: { city: "London", state: "N/A", country: "UK" },
  Tokyo: { city: "Tokyo", state: "N/A", country: "Japan" },
};

export const getWeatherData = (city) => {
  return mockWeatherData[city] || null; // Return null if no data found for the city
};
