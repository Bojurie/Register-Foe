import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./Conversations.css";

const Conversations = ({ onConversationSelect, availableUsers }) => {
  return (
    <ul className="list-group">
      {availableUsers.length > 0 ? (
        availableUsers.map((user) => (
          <li
            key={user._id}
            className="list-group-item d-flex justify-content-between align-items-center"
            onClick={() => onConversationSelect(user)}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            {`${user.username} (${user.firstName} ${user.lastName})`}
          </li>
        ))
      ) : (
        <li className="list-group-item">No users available to message.</li>
      )}
    </ul>
  );
};

export default Conversations;
