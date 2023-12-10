// import React from "react";
// import { useAuth } from "../Context/UserContext";

// const AuthContext = () => {
//   const { user, login, logout } = useAuth();

//   const handleLogin = () => {
//     login({ username: "exampleUser" });
//   };

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <div>
//       {user ? (
//         <>
//           <p>Welcome, {user.username}!</p>
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       ) : (
//         <button onClick={handleLogin}>Login</button>
//       )}
//     </div>
//   );
// };

// export default AuthContext;




import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Your authentication logic goes here
    // For simplicity, let's just set the user data if provided
    setUser(userData);
  };

   const logout = async () => {
     try {
       // Check if the user is logged in
       if (user) {
         // Perform actions before logout (e.g., saving data to the database)
         await saveUserDataToDatabase(user);

         // Clear user data upon successful actions
         setUser(null);
         window.location.href = "/"; // Change this to your home page URL
       } else {
         console.log("User is not logged in");
       }
     } catch (error) {
       console.error("Error during logout:", error);
     }
   };

   const saveUserDataToDatabase = async (userData) => {
     // Your logic to save user data to the database goes here
     // For simplicity, let's assume a delay using setTimeout
     await new Promise((resolve) => setTimeout(resolve, 1000));
     console.log("User data saved to the database:", userData);
   };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user, // Check if the user is authenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
