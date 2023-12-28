export const setStoredUser = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user data in localStorage:", error);
  }
};

export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch (parseError) {
        console.error("Error parsing user data from localStorage:", parseError);
        removeStoredUser(); 
        return null;
      }
    }
    return null; 
  } catch (error) {
    console.error("Error accessing localStorage:", error);
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
