const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: [true, "Street address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    zipCode: {
      type: String,
      required: [true, "Zip code is required"],
      validate: {
        validator: function (value) {
          return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value);
        },
        message: (props) => `${props.value} is not a valid zip code!`,
      },
    },
  },
  { _id: false }
);

module.exports = addressSchema;
