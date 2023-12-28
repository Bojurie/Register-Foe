const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  const company = await Company.findOne({ companyCode: value });
  return !!company;
}
const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  companyCode: {
    type: String,
    required: [true, "Company code is required"],
    validate: {
      validator: validateCompanyCode,
      message: (props) => `No company found with code ${props.value}`,
    },
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      vote: {
        type: String,
        required: true,
      },
    },
  ],
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
