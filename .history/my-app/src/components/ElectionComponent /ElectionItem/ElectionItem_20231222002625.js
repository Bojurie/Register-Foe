import ElectionComponent from "../ElectionComponent ";

const ElectionItem = ({ election }) => {
  return (
    <div>
      <Link to={`/elections/${election._id}`}>
        <h3>{election.electionName}</h3>
        <p>Election Date: {election.electionDate}</p>
        <p>Constituency: {election.constituency}</p>
      </Link>
      <ElectionComponent election={election} />
    </div>
  );
};
export default ElectionItem;