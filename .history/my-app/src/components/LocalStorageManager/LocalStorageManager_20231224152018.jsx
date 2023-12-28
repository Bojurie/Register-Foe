export const setStoredToken = (token) => {
  localStorage.setItem("token", token);
};

export const setStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    removeStoredUser(); // Clear potentially corrupted data
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



// export const setStoredToken = (token) => {
//   localStorage.setItem("token", token);
// };

// export const setStoredUser = (user) => {
//   localStorage.setItem("user", JSON.stringify(user));
// };

// export const getStoredUser = () => {
//   const storedUser = localStorage.getItem("user");
//   return storedUser && storedUser !== "undefined"
//     ? JSON.parse(storedUser)
//     : null;
// };

// export const removeStoredUser = () => {
//   localStorage.removeItem("user");
// };

// export const getStoredToken = () => {
//   return localStorage.getItem("token");
// };

// export const removeStoredToken = () => {
//   localStorage.removeItem("token");
// };