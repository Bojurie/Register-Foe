import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UserProvider } from "./components/Context/UserContext"
import { AuthProvider } from "./AuthContext";
const root = document.getElementById('root');
const reactRoot = createRoot(root);

reactRoot.render(
  <UserProvider>
   <AuthProvider>
      <App />
   </AuthProvider>
  </UserProvider>
);
