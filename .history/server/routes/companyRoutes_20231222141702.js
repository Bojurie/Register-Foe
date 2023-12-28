const express = require("express");
const Company = require("../model/companySchema"); 
const router = express.Router();

const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware"); 

router.post("/register", authenticateJWT, isAdmin, async (req, res) => {
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
    res.status(201).json({
      message: "Company added successfully",
      company: newCompany,
    });
  } catch (error) {
    console.error("Error adding company:", error.message);
    res.status(500).json({ error: "Failed to add company" });
  }
});

module.exports = router;


router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error retrieving companies:", error.message);
    res.status(500).json({ error: "Failed to retrieve companies" });
  }
});

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


router.put("/companies/:id", async (req, res) => {
  try {
    const { name, address, phoneNumber, photoUrl, companyCode } = req.body;
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { name, address, phoneNumber, photoUrl, companyCode },
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
