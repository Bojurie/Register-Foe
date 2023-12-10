// LocalStorageManager.js
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
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    localStorage.removeItem("user");
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
