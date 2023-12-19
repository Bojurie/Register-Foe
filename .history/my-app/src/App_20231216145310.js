import {  Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignInPage from "./components/signIn-page";
import Home from "./Home";
import Main from "./components/Main/Main";
import LandingPage from "./LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (

      <div className="App">
        <AuthProvider>
        <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/main" element={<Main />} />
            <Route path="/landing" element={<LandingPage/>} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<Dashboard />} />}
            />
          </Routes>
        </AuthProvider>
      </div>
  );
}

export default App;
