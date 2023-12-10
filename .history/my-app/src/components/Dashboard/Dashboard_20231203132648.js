import React, { useState } from "react";
import './Dashboard.css'
import { useUser } from "../Context/UserContext";


const Dashboard = () => {
    const { user, logout } = useUser();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
  });

   useEffect(() => {
     // Fetch user data from the server and update the form fields
     // You can make an Axios GET request to fetch the user data
     // Example: axios.get('/api/user').then((response) => setUserData(response.data));
   }, []);

    const handleChange = (e) => {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    };

   const handleUpdate  = async (e) => {
    e.preventDefault();
    try {
      // Make an Axios PUT request to update the user data
      await axios.put('/user', userData);
      console.log('User data updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }

  const handleLogout = () => {
     logout();
  };

  return (
    <div className="Dashboard">
      <div className="Dashboard-Wrapper">
        <div className="Top_dash">
          <h1>Welcome, {user && user.username}</h1>
          <div
            className="Logout"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <hr />
        <h3>Update Account Information</h3>
        <label>New Email:</label>
        <input
          type="email"
          name="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <label>New Password:</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
        <label>New Username:</label>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
        />
        <button onClick={handleUpdate}>Update User</button>
      </div>
    </div>
  );
};

export default Dashboard;
