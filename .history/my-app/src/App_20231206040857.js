// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignInPage from "./components/signIn-page";
import Home from "./Home";
import Dashboard from "./components/Dashboard/Dashboard";
import { useUser } from "./components/Context/UserContext";
import Main from "./components/Main/Main";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { AuthProvider } from "./components/AuthContext/AuthContext";

function App() {
  const { user } = useUser();

  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/main" element={<Main />} />
            <PrivateRoute path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
