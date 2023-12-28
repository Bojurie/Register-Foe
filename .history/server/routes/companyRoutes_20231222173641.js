const express = require("express");
const Company = require("../model/companySchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (company) => {
  const secretKey = process.env.JWT_SECRET;
  const payload = {
    id: company._id,
    companyName: company.companyName,
    companyCode: company.companyCode,
  };

  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

// Company Registration
router.post("/register", async (req, res) => {
  const {
    companyName,
    username, // Added username
    password, // Added password
    companyAddress,
    CompanyEmail,
    phoneNumber,
    companyPhotoUrl,
    companyCode,
  } = req.body;

  try {
    if (await Company.exists({ companyCode })) {
      return res.status(400).json({ error: "Company code already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCompany = new Company({
      companyName,
      username,
      password: hashedPassword,
      companyAddress,
      CompanyEmail,
      phoneNumber,
      companyPhotoUrl,
      companyCode,
    });

    await newCompany.save();

    const token = generateToken(newCompany);
    res.status(201).json({ ...newCompany.toJSON(), token });
  } catch (error) {
    console.error("Error adding company:", error);
    res.status(500).json({ error: "Failed to add company" });
  }
});

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

module.exports = router;
