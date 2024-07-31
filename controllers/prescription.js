const express = require("express");
router = express.Router();

const db = require("../db");

//fatch prescription data
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM prescriptions ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});


// Create prescription record
router.post("/createprescription", async (req, res) => {
  try {
    const {
      name,
      mobilenumber,
      sex,
      age,
      doctorname,
      guardianname,
      guardiannumber,
      location,
      price,
      rpcode,
      type,
      notes,
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
      "INSERT INTO prescriptions (name, mobilenumber, sex, age,   doctorname,  guardianname,guardiannumber,location,price,  rpcode, type, notes, note, date, tests, group_tests, medicines, selectedPackage, packageAmount, discount, netAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)";

    await db.query(
      query,
      [
        name,
        mobilenumber,
        sex,
        age,
        doctorname,
        guardianname,
        guardiannumber,
        location,
        price,
        rpcode,
        type,
        notes,
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

    // Update the pre_checkup status to 'yes'
    await db.query(
      'UPDATE pre_checkup SET doctorCheckupStatus = ? WHERE rpcode = ?',
      ['yes', rpcode]
    );

    res.status(201).json({ message: "Prescription created successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

// Create Outdoor prescription record
router.post("/createoutdoorprescription", async (req, res) => {
  try {
    const {
      patiantname,
      mobilenumber,
      sex,
      age,
      doctorname,
      guardianname,
      guardiannumber,
      address,
      price,
      orpCode,
      type,
      notes,
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
      "INSERT INTO outdoor_prescriptions (patiantname, mobilenumber, sex, age,   doctorname,  guardianname,guardiannumber,address,price,  orpCode, type, notes, note, date, tests, group_tests, medicines, selectedPackage, packageAmount, discount, netAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)";

    await db.query(
      query,
      [
        patiantname,
        mobilenumber,
        sex,
        age,
        doctorname,
        guardianname,
        guardiannumber,
        address,
        price,
        orpCode,
        type,
        notes,
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

    // Update the pre_checkup status to 'yes'
    await db.query(
      'UPDATE outdoor_pre_checkup SET doctorCheckupStatus = ? WHERE orpCode = ?',
      ['yes', orpCode]
    );

    res.status(201).json({ message: "Prescription created successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

  //prescription details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM prescriptions WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "counselling not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "counselling Server Error" });
    }
  }); 
  //Outdoor prescription details view
  router.get("/outdoor/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM outdoor_prescriptions WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "counselling not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "counselling Server Error" });
    }
  }); 

module.exports = router;