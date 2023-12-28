export const setStoredToken = (token) => {
  localStorage.setItem("token", token);
};

// Sets the user or company data in localStorage
export const setStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Retrieves and parses the user or company data from localStorage
export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    removeStoredUser();
  }
  return null;
};

export const removeStoredUser = () => {
  localStorage.removeItem("user");
};

export const getStoredToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    removeStoredToken();
  }
  return null;
};

export const removeStoredToken = () => {
  localStorage.removeItem("token");
};
