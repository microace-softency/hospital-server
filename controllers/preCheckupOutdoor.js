const express = require("express");
router = express.Router();
const db = require("../db");

//fatch Pre-Checkup
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM outdoor_pre_checkup ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });

//create Pre Check Up
  router.post('/saveoutdoorprecheckup', async (req, res) => {
    const {
      orpCode,
      date,
      address,
      patiantname,
      image,
      mobilenumber,
      sex,
      age,
      guardiannumber,
      guardianname,
      doctorname,
      doctordesignation,
      time,
      type,
      price,
      amount,
      status,
      doctorCheckupStatus,
      tests,
      notes,
      createdBy
    } = req.body;
  
    try {
      // Save the pre-checkup record
      await db.query(
        'INSERT INTO outdoor_pre_checkup (orpCode, date, address, patiantname, image, mobilenumber, sex, age, guardiannumber, guardianname, doctorname, doctordesignation, time, type, price,amount, status, doctorCheckupStatus, tests, notes, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [orpCode, date, address, patiantname, image, mobilenumber, sex, age, guardiannumber, guardianname, doctorname, doctordesignation, time, type, price, amount, status, doctorCheckupStatus, JSON.stringify(tests), notes, createdBy]
      );
  
      // Update the registration status to 'checked'
      await db.query(
        'UPDATE outdore_registation SET status = ? WHERE orpCode = ?',
        ['checked', orpCode	]
      );
  
      res.status(200).send('Outdoor-Pre-Checkup saved and registration status updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
  //Pre-Checup details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM outdoor_pre_checkup WHERE id = ?";
  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: " not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;