export const setStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  try {
    if (storedUser && typeof storedUser === "string") {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const removeStoredUser = () => {
  localStorage.removeItem("user");
};
