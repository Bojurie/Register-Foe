const express = require("express");
const Company = require("../model/companySchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const verifyToken = require("./verifyToken");


// Get All Companies
router.get("/companies/users", verifyToken, async (req, res) => {
  try {
    if (!req.user.isCompany) {
      return res
        .status(403)
        .json({ error: "Access denied: Only companies can access this route" });
    }

    const companyUsers = await User.find({ companyCode: req.user.companyCode });

    res.status(200).json(companyUsers);
  } catch (error) {
    console.error("Error retrieving company users:", error.message);
    res.status(500).json({ error: "Failed to retrieve company users" });
  }
});

// Get Company by ID
router.get("/companies/:id", verifyToken, async (req, res) => {
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
router.delete("/companies/:id", verifyToken, async (req, res) => {
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

const isCompanyCodeValid = async (code) => {
  return code === "validCode"; 
};

router.get("/verifyCode/:companyCode", verifyToken, async (req, res) => {
  try {
    const companyCode = req.params.companyCode;
    const isValid = await isCompanyCodeValid(companyCode);

    res.json({ isValid });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// authenticateJWT





router.put("/users/:userId/admin-status", verifyToken, async (req, res) => {
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
