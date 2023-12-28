export const setStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    // Check if storedUser is not null and is valid JSON
    if (storedUser && storedUser !== "undefined") {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    removeStoredUser(); // Remove invalid data from localStorage
    return null;
  }
};

export const removeStoredUser = () => {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error removing user data from localStorage:", error);
  }
};

export const setStoredToken = (token) => {
  try {
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Error storing token in localStorage:", error);
  }
};

export const getStoredToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    return null;
  }
};

export const removeStoredToken = () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};
