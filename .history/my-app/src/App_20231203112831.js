import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
// import SignIn from './components/SignIn';
import SignInPage from "./components/signIn-page";
// import SignInPage from './components/signIn-page';
import Home from "./Home";
import Dashboard from "./components/Dashboard/Dashboard";


 
function App() {
  return (
    <Router>
      <div className="App">
      
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/signin" exact element={<SignInPage />} />
          <Route path="/dashboard" exact element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;