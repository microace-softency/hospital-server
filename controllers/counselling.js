const express = require("express");
router = express.Router();

const db = require("../db");

//fatch counselling data
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM prescriptions ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });


  //counselling details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM prescriptions WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "counselling not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "counselling Server Error" });
    }
  }); 
  

module.exports = router;