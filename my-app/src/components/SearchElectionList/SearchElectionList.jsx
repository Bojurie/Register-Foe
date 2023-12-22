import ElectionComponent from "../../ElectionComponent /ElectionComponent ";

const ElectionList = ({ elections }) => {
  return (
    <div>
      {elections.map((election) => (
        <ElectionComponent key={election._id} election={election} />
      ))}
    </div>
  );
};
export default ElectionList;