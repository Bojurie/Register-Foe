router.post("/save-election", verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      electionTitle,
      electionDescription,
      electionType,
      startDate,
      endDate,
      city,
      state,
      candidates,
      companyCode,
      electionId,
    } = req.body;

    const newElection = new Election({
      title: electionTitle,
      description: electionDescription,
      electionType,
      startDate,
      endDate,
      city,
      state,
      candidates,
      companyCode,
      electionId,
    });

    await newElection.save();
    res.status(201).json({ message: "Election saved successfully" });
  } catch (error) {
    console.error("Error saving election:", error);
    res.status(500).json({
      error: "Failed to save election",
      message: error.message,
      stack: error.stack,
    });
  }
});
