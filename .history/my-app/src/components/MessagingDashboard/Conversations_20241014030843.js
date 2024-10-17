import React from "react";
import "./Conversations.css";

const Conversations = ({ onConversationSelect, availableUsers }) => {
  return (
    <div className="Conversations">
      <ul className="UserList">
        {availableUsers.length > 0 ? (
          availableUsers.map((user) => (
            <li
              key={user._id}
              className="UserItem"
              onClick={() => onConversationSelect(user)}
            >
              {`${user.username} (${user.firstName} ${user.lastName})`}
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
