import React from "react";
import "./Conversations.css";

const Conversations = ({ onConversationSelect, availableUsers }) => {
  return (
    <div className="Conversations">
      <h3>Available Users</h3>
      <ul className="UserList">
        {availableUsers.length > 0 ? (
          availableUsers.map((user) => (
            <li
              key={user._id}
              className="UserItem"
              onClick={() => onConversationSelect(user)}
            >
              {user.username}
            </li>
          ))
        ) : (
          <p>No users available to message.</p>
        )}
      </ul>
    </div>
  );
};

export default Conversations;
