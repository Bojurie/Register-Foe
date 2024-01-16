// export const setStoredToken = (token) => localStorage.setItem("token", token);
// export const getStoredToken = () => localStorage.getItem("token");
// export const removeStoredToken = () => localStorage.removeItem("token");

// export const setStoredUser = (user) => {
//   localStorage.setItem("user", JSON.stringify(user));
// };
// export const getStoredUser = () => {
//   try {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   } catch (error) {
//     console.error("Error parsing user data from localStorage:", error);
//     return null;
//   }
// };
// export const removeStoredUser = () => {
//   localStorage.removeItem("user");
// };


// storage.js
export const setStoredToken = token => localStorage.setItem("token", token);
export const getStoredToken = () => localStorage.getItem("token");
export const removeStoredToken = () => localStorage.removeItem("token");

export const setStoredUser = user => localStorage.setItem("user", JSON.stringify(user));
export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    // Handle error, possibly log it
    return null;
  }
};
export const removeStoredUser = () => localStorage.removeItem("user");
