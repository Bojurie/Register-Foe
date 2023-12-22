import React from "react";
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";
import SavedElections from "../SavedElections/SavedElections"; 
import { AuthContext } from "../AuthContext/AuthContext";

const ElectionList = ({ elections }) => {
  const { user } = useContext(AuthContext);
  const userId = user ? user.id : null; // Assuming the user object has an 'id' field

  return (
    <div className="ElectionList">
      <h3>Search Results:</h3>
      <ul>
        {elections && elections.length > 0 ? (
          elections.map((election) => (
            <li key={election._id}>
              <ElectionComponent
                date={election.date}
                city={election.city}
                state={election.state}
                candidates={election.candidates}
              />
            </li>
          ))
        ) : (
          <li>No results found.</li>
        )}
      </ul>
      <SavedElections userId={userId} />
    </div>
  );
};

export default ElectionList;
