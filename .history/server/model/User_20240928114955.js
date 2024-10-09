const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  const companyExists = await Company.exists({ companyCode: value });
  return companyExists;
}

const userSchema = new mongoose.Schema(
  {
    companyCode: {
      type: String,
      required: [true, "Company code is required"],
      validate: {
        validator: validateCompanyCode,
        message: (props) => `No company found with code ${props.value}`,
      },
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    sex: {
      type: String,
      required: false,
    },
    age: {
      type: Number,
      required: false,
    },
    userProfileImage: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
      default: "User",
    },
    userProfileDetail: {
      type: String,
      required: [true, "User profile detail is required"],
    },
    votedElections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
    savedElections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
    pastElections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
    candidateInElections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
    votes: [
      {
        election: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Election",
        },
        candidate: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        voteDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        topic: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Topic",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        dislikes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        replies: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            text: {
              type: String,
              required: true,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
            likes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            ],
            dislikes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            ],
          },
        ],
      },
    ],
    votesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
