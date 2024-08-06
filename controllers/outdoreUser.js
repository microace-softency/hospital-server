const express = require("express");
router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const db = require("../db");

//fatch outdore user
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM outdoreuser ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//create outdore
// router.post('/createoutdoreuser', async (req, res) => {
//   const { email, password } = req.body;
  
//   // Hash the password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Insert user into database
//   db.query('INSERT INTO outdoreuser (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
//     if (err) {
//       res.status(500).send('Error registering user');
//     } else {
//       res.status(201).send('User registered successfully');
//     }
//   });
// });

router.post('/createoutdoreuser', async (req, res) => {
  const { username, email, password, location } = req.body;

  try {
    // Check if username or email already exists
    const [existingUser] = await db.execute('SELECT * FROM outdoreuser WHERE username = ? OR email = ?', [username, email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert the new user into the database
    await db.execute('INSERT INTO outdoreuser (username, email, password, location) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, location]);

    res.status(201).json({ message: 'Out-Door User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  } 
});

//login out door user
router.post('/loginoutdoreuser', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM outdoreuser WHERE username = ?', [username]);

    if (rows.length === 0) {
      console.log('No user found with this username');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, userId: user.id,username: user.username, email: user.email, location: user.location  });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
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