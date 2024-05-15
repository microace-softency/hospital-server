const express = require("express");
router = express.Router();

const db = require("../db");

//fatch staff
 router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM staff ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //staff remove
  router.delete("/removestaff/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM staff WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  //create staff
  router.post("/createstaff", (req, res) => {
    const {
      name,
      degicnation,
      department,
      pf,
      esi,
      aadharcard,
      pancard,
      additionalfield,
      direction,
    } = req.body;
  
    const additionalfields = additionalfield.map((field) => field.testname).join(", ");
    const directions = direction.map((dir) => dir.directionName).join(", ");
  
    const sqlInsert =
    "INSERT INTO staff (name, degicnation, department, pf, esi, aadharcard, pancard, additionalfield, direction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  db.query(
    sqlInsert,
    [
      name,
      degicnation,
      department,
      pf,
      esi,
      aadharcard,
      pancard,
      additionalfields,
      directions,
    ],
      (error, result) => {
        if (error) {
          console.error("Error inserting data:", error);
          res.status(500).send("Error inserting data into database");
        } else {
          console.log("Data inserted successfully");
          res.status(200).send("staff  Created");
        }
      }
    );
  });
  
  //staff details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM staff WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "Staff not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 
  
  //staff details update
  router.put("/updatestaff/:id", async(req, res)=>{
    const{id}= req.params;
    const{name, degicnation, department, pf, esi, aadharcard, pancard, additionalfield, direction }= req.body
    const sqlUpdate = "UPDATE staff SET name = ? , degicnation = ? , department = ? , pf = ? , esi = ? , aadharcard = ? , pancard = ? , additionalfield = ? , direction = ? WHERE id = ?";
    await db.query(sqlUpdate, [name, degicnation, department, pf, esi, aadharcard, pancard, additionalfield, direction , id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;