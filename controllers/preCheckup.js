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

//create pre-checkup
// router.post('/saveprecheckup', (req, res) => {
//     const {
//       rpcode,
//       date,
//       location,
//       name,
//       image,
//       mobilenumber,
//       sex,
//       age,
//       guardiannumber,
//       guardianname,
//       doctorname,
//       doctordesignation,
//       time,
//       type,
//       price,
//       status,
//       doctorCheckupStatus,
//       notes
//     } = req.body;
  
//     const query = `
//       INSERT INTO pre_checkup (
//         rpcode, date, location, name, image, mobilenumber, sex, age, guardiannumber, guardianname, doctorname, doctordesignation, time, type, price, status, doctorCheckupStatus, notes
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
  
//     db.query(query, [
//       rpcode,
//       date,
//       location,
//       name,
//       image,
//       mobilenumber,
//       sex,
//       age,
//       guardiannumber,
//       guardianname,
//       doctorname,
//       doctordesignation,
//       time,
//       type,
//       price,
//       status,
//       doctorCheckupStatus,
//       notes
//     ], (error, results) => {
//       if (error) {
//         return res.status(500).send(error);
//       }
//       res.send('Pre-Checkup Saved Successfully');
//     });
//   });

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
      status,
      doctorCheckupStatus,
      notes
    } = req.body;
  
    try {
      // Save the pre-checkup record
      await db.query(
        'INSERT INTO pre_checkup (rpcode, date, location, name, image, mobilenumber, sex, age, guardiannumber, guardianname, doctorname, doctordesignation, time, type, price, status, doctorCheckupStatus, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [rpcode, date, location, name, image, mobilenumber, sex, age, guardiannumber, guardianname, doctorname, doctordesignation, time, type, price, status, doctorCheckupStatus, notes]
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
  

module.exports = router;