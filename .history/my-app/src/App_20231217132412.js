import {  Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignInPage from "./components/signIn-page";
import Register from "./register";
import Main from "./components/Main/Main";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (

      <div className="App">
        <AuthProvider>
        <Navbar/>
          <Routes>
            <Route path="/register" exact element={<Register />} />
            <Route path="/login" exact element={<SignInPage />} />
            <Route path="/main" exact element={<Main />} />
            <Route path="/" exact element={<LandingPage/>} />
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
