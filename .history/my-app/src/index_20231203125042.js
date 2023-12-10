import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UserProvider } from "./components/Context/UserContext"
const root = document.getElementById('root');
const reactRoot = createRoot(root);

reactRoot.render(
  <UserProvider>
    <App />
  </UserProvider>
);
