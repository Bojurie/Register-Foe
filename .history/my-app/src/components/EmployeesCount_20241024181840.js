const EmployeesCount = ({ companyCode }) => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if companyCode is available before making the API call
    if (!companyCode) {
      console.error("companyCode is undefined or missing in EmployeesCount");
      setError("No company code provided.");
      setLoading(false);
      return;
    }

    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get(
          `/user/users/byCompanyCode/${companyCode}`
        );
        console.log(
          `Total users for companyCode ${companyCode}:`,
          response.data.totalUsers
        );

        if (response.data && response.data.totalUsers !== undefined) {
          setTotalEmployees(response.data.totalUsers);
          setUsers(response.data.users);
          setError(null);
        } else {
          setError("No employees found for this company.");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to fetch the total number of employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [companyCode]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>{totalEmployees} Employees</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.firstName} {user.lastName} - {user.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployeesCount;
