import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignInPage from "./components/SignInPage";
import Register from "./components/Register";
import Main from "./components/Main/Main";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CandidateRegistrationForm from "./components/CandidateRegistration/CandidateRegistration";
import ElectionRegistrationForm from "./components/ElectionRegistration/ElectionRegistration";
import ElectionComponent from "./components/ElectionComponent/ElectionComponent";
import ElectionDetail from "./components/ElectionDetails/ElectionDetails";
import CompanyRegistration from "./components/CompanyRegistration/CompanyRegistration";
import CreateTopicForm from "./components/CreateTopicForm/CreateTopicForm";
import Dashboard from "./components/Dashboard/Dashboard";
import CompanyDashboard from "./components/CompanyDashboard/CompanyDashboard";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/register-candidate"
            element={<CandidateRegistrationForm />}
          />
          <Route path="/elections/:id" element={<ElectionComponent />} />
          <Route path="/elections/:id/details" element={<ElectionDetail />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route
            path="/register-election"
            element={<ElectionRegistrationForm />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companydashboard" element={<CompanyDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company" element={<CompanyRegistration />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/main" element={<Main />} />
          <Route path="/createtopic" element={<CreateTopicForm />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;