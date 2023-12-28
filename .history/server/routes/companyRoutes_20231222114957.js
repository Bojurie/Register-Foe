const express = require("express");
const Company = require("../model/companySchema"); // Adjust the path as needed
const router = express.Router();

// Route to add a new company
router.post("/register", async (req, res) => {
  try {
    const { name, address, phoneNumber, photoUrl, companyCode } = req.body;
    const newCompany = new Company({
      name,
      address,
      phoneNumber,
      photoUrl,
      companyCode,
    });
    await newCompany.save();
    res
      .status(201)
      .json({ message: "Company added successfully", company: newCompany });
  } catch (error) {
    console.error("Error adding company:", error.message);
    res.status(500).json({ error: "Failed to add company" });
  }
});

// Additional routes can be added here (e.g., fetching companies, updating, deleting)

module.exports = router;
