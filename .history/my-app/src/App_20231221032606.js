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
import CandidateRegistrationForm from "./components/CandidateRegistration/CandidateRegistration";
import ElectionRegistrationForm from "./components/ElectionRegisteration/ElectionRegistration";

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/register-candidate" element={<CandidateRegistrationForm />} />
          <Route path="/register-election" element={<ElectionRegistrationForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/" element={<LandingPage />} />
          {user && <Route path="/main" exact element={<Main />} /> }
        </Routes>
        <Footer />
      </AuthProvider>
    </div>
  );
}
export default App;
