const express = require("express");
router = express.Router();

const db = require("../db");

//fatch test data
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM test ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //remove test data
  router.delete("/removetest/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM test WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  //create test data
  router.post("/createtest", (req, res) => {
    const { testname, amount, day } = req.body;
  
    const sqlInsert =
      "INSERT INTO test (  testname, amount, day) VALUES(?, ?, ?)";
  
    db.query(sqlInsert, [testname, amount, day], (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Test Created");
      }
    });
  });
  
  //Test details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM test WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "Test not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 
  
  //Test details update
  router.put("/updatetest/:id", async(req, res)=>{
    const{id}= req.params;
    const{testname, amount, day}= req.body
    const sqlUpdate = "UPDATE test SET testname = ?, amount = ?, day = ?  WHERE id = ?";
    await db.query(sqlUpdate, [testname, amount, day, id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;
