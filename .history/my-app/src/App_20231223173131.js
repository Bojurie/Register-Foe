import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignInPage from "./components/signIn-page";
import Register from "./register";
import Main from "./components/Main/Main";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CandidateRegistrationForm from "./components/CandidateRegistration/CandidateRegistration";
import ElectionRegistrationForm from "./components/ElectionRegisteration/ElectionRegistration";
import ElectionComponent from "./components/ElectionComponent /ElectionComponent ";
import ElectionDetail from "./components/ElectionItem/ElectionItem";
import CompanyRegistration from "./components/CompanyRegistration/CompanyRegistration";
import CreateTopicForm from "./components/CreateTopicForm/CreateTopicForm";


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/register-candidate"
          element={<CandidateRegistrationForm />}
        />
        <Route path="/elections/:id" element={<ElectionComponent />} />
        <Route path="/elections/:id/details" element={<ElectionDetail />} />
        <Route
          path="/register-election"
          element={<ElectionRegistrationForm />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/company" element={<CompanyRegistration/> } />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/main" element={<Main />} />
        <Route path="/createtopic" element={<CreateTopicForm/>} />
        <Route path="/" element={<LandingPage />} />
        
      </Routes>
      <Footer />
    </div>
  );
}

export default App;