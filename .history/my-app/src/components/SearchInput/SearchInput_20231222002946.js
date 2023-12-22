
const SearchInput = ({ onSearchChange, loading }) => {
  return (
    <div>
      <label htmlFor="userInput">Search:</label>
      <input
        type="text"
        id="userInput"
        onChange={(e) => onSearchChange(e.target.value)}
        disabled={loading}
      />
    </div>
  );
};

export default SearchInput;