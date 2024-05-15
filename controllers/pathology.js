const express = require("express");
router = express.Router();

const db = require("../db");

//fatch pathology  user
 router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM pathology ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //remove pathology user
  router.delete("/removepathology/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM pathology WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  //create pathology
  router.post("/createpathology", (req, res) => {
    const {
      patientname,
      patientnumber,
      testname,
      referDrName,
      totalAmount,
      advancePayment,
      duePayment,
      date,
    } = req.body;
  
    const testnames = testname.map((test) => test.testname);
  
    const testnamesString = testnames.join(", ");
  
    const sqlInsert =
      "INSERT INTO pathology (patientname, patientnumber, testname, referDrName, totalAmount, advancePayment, duePayment, date) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
  
    db.query(
      sqlInsert,
      [
        patientname,
        patientnumber,
        testnamesString,
        referDrName,
        totalAmount,
        advancePayment,
        duePayment,
        date,
      ],
      (error, result) => {
        if (error) {
          console.error("Error inserting data:", error);
          res.status(500).send("Error inserting data into database");
        } else {
          console.log("Data inserted successfully");
          res.status(200).send("New pathology patient Created");
        }
      }
    );
  });
  
  //pathology details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM pathology WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "Data not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 
  
  //pathology details update
  router.put("/updatepathology/:id", async(req, res)=>{
    const{id}= req.params;
    const{patientname, patientnumber, testname, referDrName, totalAmount, advancePayment, duePayment, date }= req.body
    const sqlUpdate = "UPDATE pathology SET patientname = ? , patientnumber = ? , testname = ? , referDrName = ? , totalAmount = ? , advancePayment = ? , duePayment = ? , date = ? WHERE id = ?";
    await db.query(sqlUpdate, [patientname, patientnumber, testname, referDrName, totalAmount, advancePayment, duePayment, date , id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;