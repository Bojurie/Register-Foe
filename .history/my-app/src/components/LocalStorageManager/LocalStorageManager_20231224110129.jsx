export const setStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
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
