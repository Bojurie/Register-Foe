import React, {useEffect} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import { AuthProvider, useAuth } from "./components/AuthContext/AuthContext";
import ElectionComponent from "./components/ElectionComponent /ElectionComponent ";
import './App.css'
import { ThemeProvider, useTheme } from "./components/ThemeContext";

function ProtectedRoute({ children }) {
  const { user, authChecking } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--background-color",
      theme.background
    );
    document.documentElement.style.setProperty("--text-color", theme.color);
    document.documentElement.style.setProperty(
      "--button-background",
      theme.button.background
    );
    document.documentElement.style.setProperty(
      "--button-color",
      theme.button.color
    );
    document.documentElement.style.setProperty(
      "--button-hover-background",
      theme.button.hoverBackground
    );
    document.documentElement.style.setProperty(
      "--heading-color",
      theme.heading.color
    );
    document.documentElement.style.setProperty(
      "--link-color",
      theme.text.color
    );
    document.documentElement.style.setProperty(
      "--link-hover-color",
      theme.button.hoverBackground
    );
  }, [theme]);

  if (authChecking) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
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