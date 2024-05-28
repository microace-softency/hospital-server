const express = require("express");
router = express.Router();

const db = require("../db");

const getNextStaffCode = async () => {
  const [result] = await db.query("SELECT MAX(CAST(SUBSTRING(scode, 3) AS UNSIGNED)) AS maxCode FROM staff");
  const maxCode = result[0].maxCode || 0; 
  const nextCode = (maxCode + 1).toString().padStart(3, '0');
  return `SC${nextCode}`;
};

router.get("/nextstaffcode", async (req, res) => {
  try {
    const nextStaffCode = await getNextStaffCode();
    res.json({ StaffCode: nextStaffCode });
  } catch (error) {
    console.error("Error generating next Staff code:", error);
    res.status(500).json({ error: "Error generating next Staff code" });
  }
});

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
  router.post("/createstaff",  async (req, res) => {
    try{
    const scode = await getNextStaffCode();
    const {
      name,
      degicnation,
      department,
      pf,
      esi,
      aadharcard,
      pancard,
      additionalfield
    } = req.body;
    
    const additionalfields = additionalfield.map((field) => field.testname).join(", ");
  
    const sqlInsert =
    `INSERT INTO staff (
       scode, name, degicnation, department, pf, esi, aadharcard, pancard, additionalfield
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(
    sqlInsert,
    [
      scode,
      name,
      degicnation,
      department,
      pf,
      esi,
      aadharcard,
      pancard,
      additionalfields,
    ],);
    }
    catch {
      (error, result) => {
        if (error) {
          console.error("Error inserting data:", error);
          res.status(500).send("Error inserting data into database");
        } else {
          console.log("Data inserted successfully");
          res.status(200).send("staff  Created");
        }
      }
    }
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
    const{scode, name, degicnation, department, pf, esi, aadharcard, pancard, additionalfield }= req.body
    const sqlUpdate = "UPDATE staff SET scode = ?, name = ? , degicnation = ? , department = ? , pf = ? , esi = ? , aadharcard = ? , pancard = ? , additionalfield = ?  WHERE id = ?";
    await db.query(sqlUpdate, [scode, name, degicnation, department, pf, esi, aadharcard, pancard, additionalfield , id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;