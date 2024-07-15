const express = require("express");
router = express.Router();

const db = require("../db");

// Create prescription record
router.post("/createprescription", async (req, res) => {
  try {
    const {
      name,
      mobilenumber,
      sex,
      age,
      note,
      date,
      tests,
      group_tests,
      medicines,
      selectedPackage,
      packageAmount,
      discount,
      netAmount
    } = req.body;
    
    const query =
      "INSERT INTO prescriptions (name, mobilenumber, sex, age, note, date, tests, group_tests, medicines, selectedPackage, packageAmount, discount, netAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    await db.query(
      query,
      [
        name,
        mobilenumber,
        sex,
        age,
        note,
        date,
        JSON.stringify(tests),
        JSON.stringify(group_tests),
        JSON.stringify(medicines),
        selectedPackage,
        packageAmount,
        discount,
        netAmount
      ]
    );
    res.status(201).json({ message: "Prescription created successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

module.exports = router;