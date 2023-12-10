import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignInPage from "./components/signIn-page";
import Home from "./Home";
import Dashboard from "./components/Dashboard/Dashboard";
import { useUser } from "./components/Context/UserContext";
import Main from "./components/Main/Main";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { user } = useUser();

  return (
    <Router>
      <div className="App">
        <Routes>
         <Route path="/" exact element={<Home />} />,
             <Route path="/signin" exact element={<SignInPage />} />
             <Route path="/main" exact element={<Main/> } />
             <PrivateRoute path="/dashboard" component={<Dashboard/>} /> 
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
