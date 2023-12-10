// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { useUser } from "./components/Context/UserContext";
import { AuthProvider } from "./components/AuthContext/AuthContext";

import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignInPage from "./components/signIn-page";
import Home from "./Home";
import Main from "./components/Main/Main";


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
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
