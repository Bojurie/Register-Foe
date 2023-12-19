import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./components/AuthContext/AuthContext";
// import PrivateRoute from "./components/PrivateRoute/PrivateRoute"; 
import SignInPage from "./components/signIn-page";
import Register from "./register";
import Main from "./components/Main/Main";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Dashboard from "./components/Dashboard/Dashboard";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" replace /> 
  );
};
function App() {
  return (
    <>
      {" "}
      <div className="App">
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/" element={<LandingPage />} />
            <PrivateRoute path="/main" element={<Main />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
