const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  party: String,
  pastAccomplishments: [String],
  promises: [String],
  likes: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  dateOfBirth: Date,
  email: String,
  phoneNumber: String,
  address: String,
  politicalParty: String,
  campaignWebsite: String,
  biography: String,
  profileImage: String,
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
  },
  electionInfo: {
    electionName: String,
    electionDate: Date,
    constituency: String,
  },
});

const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);

module.exports = CandidateProfile;
