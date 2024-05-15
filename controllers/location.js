const express = require("express");
router = express.Router();

const db = require("../db");



//fatch location data
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM location ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //crete location
  router.post("/createlocation", (req, res) => {
    const { address, district, pincode, pos, postoffice } = req.body;
  
    const sqlInsert =
      "INSERT INTO location ( address, district, pincode, pos, postoffice) VALUES(?, ?, ?, ?, ?)";
  
    db.query(
      sqlInsert,
      [address, district, pincode, pos, postoffice],
      (error, result) => {
        if (error) {
          console.error("Error inserting data:", error);
          res.status(500).send("Error inserting data into database");
        } else {
          console.log("Data inserted successfully");
          res.status(200).send("Doctor Created");
        }
      }
    );
  });
  
  //location remove
  router.delete("/removelocation/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM location WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  //location details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM location WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "Location not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 
  
  //location details update
  router.put("/updatelocation/:id", async(req, res)=>{
    const{id}= req.params;
    const{address, district, pincode, pos, postoffice}= req.body
    const sqlUpdate = "UPDATE location SET address = ?, district = ?, pincode = ?, pos = ?, postoffice = ?  WHERE id = ?";
    await db.query(sqlUpdate, [address, district, pincode, pos, postoffice, id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });


module.exports = router;