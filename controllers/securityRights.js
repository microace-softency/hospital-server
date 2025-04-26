const express = require('express');
const router = express.Router();
const db = require('../db');

// router.post('/', (req, res) => {
//     const { name, permissions } = req.body;
//     console.log('Request body:', req.body); // Log the request body for debugging
    
  
//     const sql = 'INSERT INTO security_groups (name, permissions) VALUES (?, ?)';
//     db.query(sql, [name, JSON.stringify(permissions)], (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error saving security group');
//         return;
//       }
//       res.status(200).send({ message: 'Security group saved successfully!', id: result.insertId });
//     });
//   });


  router.post("/", async(req, res) => {
    try{
        const { name, permissions } = req.body;

  
    const sqlInsert = "INSERT INTO security_groups (name, permissions) VALUES (?, ?)";
  
    db.query(sqlInsert, [name, JSON.stringify(permissions)]);
    res.status(200).send("Bed Security Group Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
  });

  module.exports = router;