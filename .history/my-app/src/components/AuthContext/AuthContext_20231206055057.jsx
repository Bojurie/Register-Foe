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

  const logout = () => {
    // Your logout logic goes here
    setUser(null);
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
