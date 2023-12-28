const express = require("express");
const Company = require("../model/companySchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");


// Get All Companies
router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error retrieving companies:", error.message);
    res.status(500).json({ error: "Failed to retrieve companies" });
  }
});

// Get Company by ID
router.get("/companies/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error("Error retrieving company:", error.message);
    res.status(500).json({ error: "Failed to retrieve company" });
  }
});

// Update Company
router.put("/companies/:id", async (req, res) => {
  const {
    companyName,
    username,
    password,
    companyAddress,
    CompanyEmail,
    phoneNumber,
    companyPhotoUrl,
    companyCode,
  } = req.body;

  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      {
        companyName,
        username,
        password,
        companyAddress,
        CompanyEmail,
        phoneNumber,
        companyPhotoUrl,
        companyCode,
      },
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }
    res
      .status(200)
      .json({
        message: "Company updated successfully",
        company: updatedCompany,
      });
  } catch (error) {
    console.error("Error updating company:", error.message);
    res.status(500).json({ error: "Failed to update company" });
  }
});

// Delete Company
router.delete("/companies/:id", async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndRemove(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error.message);
    res.status(500).json({ error: "Failed to delete company" });
  }
});



router.get("/users/by-company", async (req, res) => {
  const companyCode = req.query.companyCode;

  if (!companyCode) {
    return res.status(400).json({ error: "Company code is required" });
  }

  try {
    const users = await User.find({ companyCode: companyCode });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// authenticateJWT

router.get("/users-by-company", , async (req, res) => {
  try {
    if (!req.user || (!req.user.isCompany && !req.user.isAdmin)) {
      return res
        .status(403)
        .json({
          error: "Unauthorized: Access restricted to company or admin users",
        });
    }

    // Fetch users that belong to the same company code as the requesting user
    const users = await User.find({ companyCode: req.user.companyCode });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});





router.put("/users/:userId/admin-status", async (req, res) => {
  const userId = req.params.userId;
  const { isAdmin, companyCode } = req.body;

  if (isAdmin === undefined || !companyCode) {
    return res
      .status(400)
      .json({ error: "Admin status and company code are required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.companyCode !== companyCode) {
      return res
        .status(403)
        .json({ error: "Unauthorized to change admin status for this user" });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.status(200).json({ message: "User admin status updated successfully" });
  } catch (error) {
    console.error("Error updating user admin status:", error.message);
    res.status(500).json({ error: "Failed to update user admin status" });
  }
});

module.exports = router;
