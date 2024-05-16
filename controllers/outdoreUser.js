const express = require("express");
router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../db");

//fatch outdore user
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM outdoreuser ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//create outdore
router.post('/createoutdoreuser', async (req, res) => {
  const { email, password } = req.body;
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into database
  db.query('INSERT INTO outdoreuser (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
    if (err) {
      res.status(500).send('Error registering user');
    } else {
      res.status(201).send('User registered successfully');
    }
  });
});

//outdoreuser remove
router.delete("/removeoutdoreuser/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM outdoreuser WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

module.exports = router;