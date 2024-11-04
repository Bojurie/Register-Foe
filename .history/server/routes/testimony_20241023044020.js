
const express = require("express");
const { check, validationResult } = require("express-validator");
const Testimony = require("../model/testimony");
const router = express.Router();



// POSTING NEW TESTIMONY
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("position", "Position is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("testimony", "Testimony text is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, position, company, testimony } = req.body;

    try {
      const newTestimony = new Testimony({
        name,
        position,
        company,
        testimony,
      });

      const savedTestimony = await newTestimony.save();

      res.status(201).json(savedTestimony);
    } catch (error) {
      console.error("Error saving testimony:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);


// GET TESTIMONY
router.get("/", async (req, res) => {
  try {
    const testimonies = await Testimony.find().sort({ date: -1 });
    res.json(testimonies);
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    res.status(500).send("Server Error");
  }
});


// @route   DELETE /testimonies/:id
router.delete("/:id", async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);

    if (!testimony) {
      return res.status(404).json({ msg: "Testimony not found" });
    }

    await testimony.remove();
    res.json({ msg: "Testimony removed" });
  } catch (error) {
    console.error("Error deleting testimony:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
