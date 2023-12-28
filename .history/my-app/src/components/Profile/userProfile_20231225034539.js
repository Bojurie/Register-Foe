import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import { GetUsersByCode } from "../AuthAPI/AuthAPI";
import axios from "axios";


function UserProfile() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
   const source = axios.CancelToken.source();

   const fetchUsers = async () => {
     try {
       setIsLoading(true);
       const response = await GetUsersByCode({ cancelToken: source.token });
       console.log("API Response:", response); // Debugging line

       if (Array.isArray(response.data)) {
         setUsers(response.data);
       } else {
         console.error("Invalid data format received:", response.data);
       }
     } catch (error) {
       console.error("Error fetching users:", error);
     } finally {
       setIsLoading(false);
     }
   };

   fetchUsers();

   return () => {
     source.cancel("Component unmounted, cancel axios request");
   };
 }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profiles</h2>
      {users && users.map((user) => <Profile key={user._id} user={user} />)}
    </div>
  );
}

export default UserProfile;
