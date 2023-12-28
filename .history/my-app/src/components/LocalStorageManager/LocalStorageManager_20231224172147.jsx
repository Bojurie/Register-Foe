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
      const parsedUser = JSON.parse(storedUser);
      console.log("Stored user data:", parsedUser);

      console.log("isCompany flag in stored user data:", parsedUser.isCompany);

      return parsedUser;
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
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      return token;
    }
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    removeStoredToken(); 
  }
  return null;
};

export const removeStoredToken = () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};
