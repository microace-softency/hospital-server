const express = require("express");
router = express.Router();

const db = require("../db");

//fatch bed
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM bed ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //Bed remove
  router.delete("/removebed/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM bed WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  //create bed
  router.post("/createbed", (req, res) => {
    const { bedname, type } = req.body;
  
    const sqlInsert = "INSERT INTO bed ( bedname, type) VALUES(?, ?)";
  
    db.query(sqlInsert, [bedname, type], (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("bed  Created");
      }
    });
  });
  
  //Bed details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM bed WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "Bed not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 
  
  //Bed details update
  router.put("/updatebed/:id", async(req, res)=>{
    const{id}= req.params;
    const{bedname, type }= req.body
    const sqlUpdate = "UPDATE bed SET bedname = ?, type = ?  WHERE id = ?";
    await db.query(sqlUpdate, [bedname, type,  id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;