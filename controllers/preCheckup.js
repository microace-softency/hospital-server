const express = require("express");
router = express.Router();
const db = require("../db");

//fatch Pre-Checkup
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM pre_checkup ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });

//create Pre Check Up
  router.post('/saveprecheckup', async (req, res) => {
    const {
      rpcode,
      date,
      location,
      name,
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
      notes
    } = req.body;
  
    try {
      // Save the pre-checkup record
      await db.query(
        'INSERT INTO pre_checkup (rpcode, date, location, name, image, mobilenumber, sex, age, guardiannumber, guardianname, doctorname, doctordesignation, time, type, price,amount, status, doctorCheckupStatus, tests, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [rpcode, date, location, name, image, mobilenumber, sex, age, guardiannumber, guardianname, doctorname, doctordesignation, time, type, price, amount, status, doctorCheckupStatus, JSON.stringify(tests), notes]
      );
  
      // Update the registration status to 'checked'
      await db.query(
        'UPDATE registation SET status = ? WHERE rpcode = ?',
        ['checked', rpcode]
      );
  
      res.status(200).send('Pre-Checkup saved and registration status updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
  //Pre-Checup details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM pre_checkup WHERE id = ?";
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