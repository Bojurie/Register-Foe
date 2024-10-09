const ElectionDetails = ({ election }) => {
  const { handleSaveElection, getCandidatesById } = useAuth();
  const [userProfiles, setUserProfiles] = useState([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCandidateProfiles = async () => {
      if (!election?._id) {
        setError("Election ID not available.");
        return;
      }

      try {
        const profiles = await getCandidatesById(election._id);
        if (profiles && profiles.length > 0) {
          setUserProfiles(profiles);
          setError("");
        } else {
          setError("No candidates available for this election.");
        }
      } catch (error) {
        console.error("Error fetching candidate profiles:", error);
        setError("Failed to fetch candidate profiles.");
      }
    };

    fetchCandidateProfiles();
  }, [election?._id, getCandidatesById]);

  const initiateSaveElection = async () => {
    setIsSaving(true);

    try {
      const result = await handleSaveElection(election._id);
      if (result?.success) {
        setSaved(true);
        setError("");
      } else {
        throw new Error("Could not save the election.");
      }
    } catch (err) {
      setError("Failed to save the election.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ElectionDetails">
      <h1>{election?.title || "Election Details"}</h1>
      <p>
        <span>Type of Election:</span> {election?.electionType || "N/A"}
      </p>
      <div>
        <p>
          <span>Start Date:</span>{" "}
          {election?.startDate
            ? new Date(election.startDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <span>End Date:</span>{" "}
          {election?.endDate
            ? new Date(election.endDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
      <p>
        <span>City:</span> {election?.city || "N/A"}
      </p>
      <p>
        <span>State:</span> {election?.state || "N/A"}
      </p>
      <p>
        <span>About:</span> {election?.description || "No description provided"}
      </p>

      <div>
        {userProfiles && userProfiles.length > 0 ? (
          <>
            <h3>Candidates</h3>
            {userProfiles.map((profile) => (
              <UserProfile key={profile._id} profile={profile} />
            ))}
          </>
        ) : (
          <p>{error || "No candidates to display."}</p>
        )}
      </div>

      {!saved ? (
        <button onClick={initiateSaveElection} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Election"}
        </button>
      ) : (
        <p>Election saved successfully!</p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ElectionDetails;
