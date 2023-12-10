import React from "react";
import Dashboard from "../Dashboard/Dashboard";
// import ElectionList from "../ElectionList/ElectionList";
import "./Main.css"; // Import the CSS file

const Main = () => {
  return (
    <div className="Main">
      {" "}
      {/* Remove .css from className */}
      <Dashboard />
      {/* <ElectionList /> */}
    </div>
  );
};

export default Main;
