const express = require("express");
router = express.Router();

const db = require("../db");

//create batch
app.post("/api/createbatch", (req, res) => {
    const { inout, docno, productcode, batchno, slno, mfgdate, expdate, qty } = req.body;
    console.log(req.body);
    const sqlInsert =
      "INSERT INTO whbatch ( `inout`, docno, productcode, batchno, slno, mfgdate, expdate, qty) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
  
    db.query(
      sqlInsert,
      [inout, docno, productcode, batchno, slno, mfgdate, expdate, qty],
      (error, result) => {
        if (error) {
          console.error("Error inserting data:", error);
          res.status(500).send("Error inserting data into database");
        } else {
          console.log("Data inserted successfully");
          res.status(200).send("Batch  Created");
        }
      }
    );
  });

module.exports = router;