import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import { likeUser, voteForUser } from "../AuthAPI/AuthAPI";
import { useAuth } from "../AuthContext/AuthContext";
import { useSnackbar } from "notistack";

function UserProfile() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, fetchUserByCompanyCode } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let isMounted = true; // flag to indicate if the component is mounted

    const fetchUsers = async () => {
      if (!user || !user.isCompany || !user.companyCode) {
        console.error(
          "User object is missing or does not have a company code."
        );
        enqueueSnackbar("Cannot load user profiles", { variant: "error" });
        return;
      }

      try {
        setIsLoading(true);
        const fetchedUsers = await fetchUserByCompanyCode(user.companyCode);
        if (isMounted) {
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (isMounted) {
          enqueueSnackbar("Failed to load user profiles", { variant: "error" });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false; // set flag to false when the component unmounts
    };
  }, [user, fetchUserByCompanyCode, enqueueSnackbar]);

  const updateUsers = (userId, actionType) => {
    setUsers(
      users.map((u) => {
        if (u._id === userId) {
          return actionType === "like"
            ? { ...u, likes: (u.likes || 0) + 1 }
            : { ...u, votes: (u.votes || 0) + 1 };
        }
        return u;
      })
    );
  };

  const onViewProfile = (user) => {
    // Example implementation
    console.log("Viewing profile of", user.name);
    // Add your logic here for what should happen when a profile is viewed
  };

  const onLikeProfile = async (likedUser) => {
    try {
      await likeUser(likedUser._id);
      updateUsers(likedUser._id, "like");
      enqueueSnackbar("Profile liked successfully", { variant: "success" });
    } catch (error) {
      console.error("Error liking profile:", error);
      enqueueSnackbar("Failed to like profile", { variant: "error" });
    }
  };

  const onVoteProfile = async (votedUser) => {
    try {
      await voteForUser(votedUser._id);
      updateUsers(votedUser._id, "vote");
      enqueueSnackbar("Voted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error voting for profile:", error);
      enqueueSnackbar("Failed to vote", { variant: "error" });
    }
  };

  if (isLoading) {
    return <div>Loading user profiles...</div>;
  }

  return (
    <div>
      <h2>User Profiles</h2>
      <div className="Profile-Wrapper">
        {users && users.length > 0 ? (
          users.map((user) => (
            <Profile
              key={user._id}
              user={user}
              onViewProfile={() => onViewProfile(user)}
              onLikeProfile={() => onLikeProfile(user)}
              onVoteProfile={() => onVoteProfile(user)}
            />
          ))
        ) : (
          <div>No user profiles found.</div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
