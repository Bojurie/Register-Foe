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
  // ... your authentication logic

  return (
    <AuthContext.Provider
      value={
        {
          /* your authentication state and methods */
        }
      }
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};