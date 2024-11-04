export const mockWeatherData = {
  locations: {
    NewYork: {
      current: {
        temp: 18,
        weather: [{ description: "Clear sky", icon: "01d" }],
      },
      timezone: "America/New_York",
    },
    London: {
      current: {
        temp: 15,
        weather: [{ description: "Overcast clouds", icon: "04d" }],
      },
      timezone: "Europe/London",
    },
    Tokyo: {
      current: {
        temp: 22,
        weather: [{ description: "Light rain", icon: "09d" }],
      },
      timezone: "Asia/Tokyo",
    },
  },
};

export const mockLocationData = {
  NewYork: {
    city: "New York",
    state: "NY",
    country: "US",
  },
  London: {
    city: "London",
    country: "GB",
  },
  Tokyo: {
    city: "Tokyo",
    country: "JP",
  },
};
