const express = require("express");
router = express.Router();

const db = require("../db");

//fatch packeg
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM packeg ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  //remove packeg
  router.delete("/removeapackeg/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM packeg WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  //create packeg
  router.post("/createpackeg", (req, res) => {
    const { packegname, packegrate, packegnote } = req.body;
  
    const sqlInsert =
      "INSERT INTO packeg (packegname, packegrate, packegnote ) VALUES( ?, ?, ? )";
  
    db.query(sqlInsert, [packegname, packegrate, packegnote], (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Doctor Created");
      }
    });
  });
  
  
  //packeg details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM packeg WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "Packeg not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 
  
  //packeg details update
  router.put("/updatepackeg/:id", async(req, res)=>{
    const{id}= req.params;
    const{packegname, packegrate, packegnote }= req.body
    const sqlUpdate = "UPDATE packeg SET packegname = ?, packegrate = ?, packegnote = ? WHERE id = ?";
    await db.query(sqlUpdate, [packegname, packegrate, packegnote , id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });
  

module.exports = router;