import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./components/AuthContext/AuthContext";
import SignInPage from "./components/signIn-page";
import Register from "./register";
import Main from "./components/Main/Main";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  const { user, isAuthenticated } = useAuth();
  return (
    <div className="App">
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/" element={<LandingPage />} />
          {isAuthenticated && (
            <Route
              path="/main"
              element={
                user ? <Main /> : <SignInPage /> 
              }
            />
          )}
        </Routes>
        <Footer />
      </AuthProvider>
    </div>
  );
}
export default App;
