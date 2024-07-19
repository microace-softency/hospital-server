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
    const { bedname, type, status } = req.body;
  
    const sqlInsert = "INSERT INTO bed (bedcode, bedname, type, status) VALUES(?, ?, ?, ?)";
  
    db.query(sqlInsert, [BedCode, bedname, type, status]);
    res.status(200).send("Bed Created");
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
    const{bedcode,bedname, type, status }= req.body
    const sqlUpdate = "UPDATE bed SET bedcode = ?, bedname = ?, type = ?, status = ?  WHERE id = ?";
    await db.query(sqlUpdate, [bedcode, bedname, type, status, id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

// Update bed status
// router.put("/:id/status", async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   console.log('check', id, status);
//   const sqlUpdateStatus = "UPDATE bed SET status = ? WHERE id = ?";
//   try {
//     const [result] = await db.query(sqlUpdateStatus, [status, id]);
//     res.json({ message: "Bed status updated successfully" });
//   } catch (error) {
//     console.error("Error updating bed status:", error);
//     res.status(500).json({ error: "Error updating bed status" });
//   }
// });

// // Get bed ID by name
// router.get("/bedId/:bedName", async (req, res) => {
//   const { bedName } = req.params;
//   const sqlGetBedId = "SELECT id FROM bed WHERE name = ?";
//   try {
//     const [result] = await db.query(sqlGetBedId, [bedName]);
//     if (result.length > 0) {
//       res.json({ bedId: result[0].id });
//     } else {
//       res.status(404).json({ error: "Bed not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching bed ID:", error);
//     res.status(500).json({ error: "Error fetching bed ID" });
//   }
// });

// Get bed ID by name
router.get("/bedId/:bedName", async (req, res) => {
  const { bedName } = req.params;
  const sqlGetBedId = "SELECT id FROM bed WHERE bedname = ?"; 
  try {
    const [result] = await db.query(sqlGetBedId, [bedName]);
    if (result.length > 0) {
      res.json({ bedId: result[0].id });
    } else {
      res.status(404).json({ error: "Bed not found" });
    }
  } catch (error) {
    console.error("Error fetching bed ID:", error);
    res.status(500).json({ error: "Error fetching bed ID" });
  }
});

// Update bed status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sqlUpdateStatus = "UPDATE bed SET status = ? WHERE id = ?";
  try {
    const [result] = await db.query(sqlUpdateStatus, [status, id]);
    res.json({ message: "Bed status updated successfully" });
  } catch (error) {
    console.error("Error updating bed status:", error);
    res.status(500).json({ error: "Error updating bed status" });
  }
});


module.exports = router;