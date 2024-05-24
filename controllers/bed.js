const express = require("express");
router = express.Router();

const db = require("../db");

const getNextBedCode = async () => {
  const [result] = await db.query(
    "SELECT MAX(CAST(SUBSTRING(bedcode, 3) AS UNSIGNED)) AS maxCode FROM bed"
  );
  const maxCode = result[0].maxCode || 0;
  const nextCode = (maxCode + 1).toString().padStart(3, "0");
  return `BC${nextCode}`;
};

router.get("/nextbedcode", async (req, res) => {
  try {
    const nextBedCode = await getNextBedCode();
    res.json({ BedCode: nextBedCode });
  } catch (error) {
    console.error("Error generating next Bed code:", error);
    res.status(500).json({ error: "Error generating next Bed code" });
  }
});

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
  router.post("/createbed", async(req, res) => {
    try{
      const BedCode = await getNextBedCode()
    const { bedname, type } = req.body;
  
    const sqlInsert = "INSERT INTO bed (bedcode, bedname, type) VALUES(?, ?, ?)";
  
    db.query(sqlInsert, [BedCode, bedname, type]);
    res.status(200).send("Location Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
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
    const{dcode,bedname, type }= req.body
    const sqlUpdate = "UPDATE bed SET dcode = ?, bedname = ?, type = ?  WHERE id = ?";
    await db.query(sqlUpdate, [dcode, bedname, type,  id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;