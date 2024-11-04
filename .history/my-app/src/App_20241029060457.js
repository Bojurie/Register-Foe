import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SignInPage from "./components/signIn-page";
import Register from "./register";
import Main from "./components/Main/Main";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CandidateRegistrationForm from "./components/CandidateRegistration/CandidateRegistration";
import ElectionRegistrationForm from "./components/ElectionRegisteration/ElectionRegistration";
import ElectionDetail from "./components/ElectionDetails/ElectionDetails";
import CompanyRegistration from "./components/CompanyRegistration/CompanyRegistration";
import CreateTopicForm from "./components/CreateTopicForm/CreateTopicForm";
import CompanyDashboard from "./components/CompanyDashboard/CompanyDashboard";
import Profile from "./components/Profile/Profile";
import AboutUs from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ElectionComponent from "./components/ElectionComponent/ ElectionComponent";
import "./App.css";
import {
  ThemeProvider,
  GlobalStyle,
  theme,
} from "./components/StyledComponents";

function App() {
  const [currentTheme, setCurrentTheme] = useState(theme.default);

  const updateTheme = (hour) => {
    if (hour >= 6 && hour < 18) {
      setCurrentTheme(theme.day);
    } else {
      setCurrentTheme(theme.night);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    updateTheme(hour);
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/company" element={<CompanyRegistration />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companydashboard"
              element={
                <ProtectedRoute>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register-candidate"
              element={
                <ProtectedRoute>
                  <CandidateRegistrationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/elections/:id"
              element={
                <ProtectedRoute>
                  <ElectionComponent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/elections/:id/details"
              element={
                <ProtectedRoute>
                  <ElectionDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register-election"
              element={
                <ProtectedRoute>
                  <ElectionRegistrationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createtopic"
              element={
                <ProtectedRoute>
                  <CreateTopicForm />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
