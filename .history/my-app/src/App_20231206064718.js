// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import { UserProvider } from "./components/Context/UserContext";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignInPage from "./components/signIn-page";
import Home from "./Home";
import Main from "./components/Main/Main";

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <UserProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<SignInPage />} />
              <Route path="/main" element={<Main />} />
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route index element={<Dashboard />} />
              </Route>
            </Routes>
          </UserProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
