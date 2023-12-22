const electionSchema = new mongoose.Schema({
  electionName: { type: String, required: true },
  electionDate: { type: Date, required: true },
  constituency: String,
  candidates: [
    {
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateProfile",
      },
      votes: { type: Number, default: 0 },
    },
  ],
});
