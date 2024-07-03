const express = require("express");
router = express.Router();

const db = require("../db");


  //fatch admision  user
 router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM admissions ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //remove admision user
  router.delete("/removeadmission/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM admissions WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  // create admision data
  router.post("/createadmision", (req, res) => {
    const {
      name,
      address,
      mobilenumber,
      pincode,
      block,
      age,
      sex,
      doctor,
      date,
      time,
      guardiannumbaer,
      guardianname,
      bed,
      packages
    } = req.body;
  
    const sqlInsert =
      "INSERT INTO admissions (  name, address, mobilenumber, pincode, block, age, sex, doctor, date, time, guardiannumbaer, guardianname, bed, packages) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
    db.query(
      sqlInsert,
      [
        name,
        address,
        mobilenumber,
        pincode,
        block,
        age,
        sex,
        doctor,
        date,
        time,
        guardiannumbaer,
        guardianname,
        bed,
        packages
      ],
      (error, result) => {
        if (error) {
          console.error("Error inserting data:", error);
          res.status(500).send("Error inserting data into database");
        } else {
          console.log("Data inserted successfully");
          res.status(200).send("Admission Created");
        }
      }
    );
  });
  
  //Admssion details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM admissions WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "Admissions Data not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 
  
  //Admssion details update
  router.put("/updateadmission/:id", async(req, res)=>{
    const{id}= req.params;
    const{name, address, mobilenumber, pincode, block, age, sex, doctor, date, time, guardiannumbaer, guardianname, bed, packages }= req.body
    const sqlUpdate = "UPDATE admissions SET name = ?, address = ?, mobilenumber = ?, pincode = ?, block = ?, age = ?, sex = ?, doctor = ?, date = ?, time = ?, guardiannumbaer = ?, guardianname = ?, bed = ?, packages = ? WHERE id = ?";
    await db.query(sqlUpdate, [name, address, mobilenumber, pincode, block, age, sex, doctor, date, time, guardiannumbaer, guardianname, bed , packages, id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });


module.exports = router;