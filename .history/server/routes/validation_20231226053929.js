const express = require("express");
const bcrypt = require("bcrypt");


function validateRegistrationData(data) {
  if (
    !data.firstName ||
    !data.lastName ||
    !data.email ||
    !data.username ||
    !data.password ||
    !data.companyCode
  ) {
    return "All fields are required";
  }
}

module.exports = validateRegistrationData;
