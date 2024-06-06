const express = require("express");
router = express.Router();

const db = require("../db");

const getNextDepartmentCode = async () => {
  const [result] = await db.query(
    "SELECT MAX(CAST(SUBSTRING(dpcode, 3) AS UNSIGNED)) AS maxCode FROM department"
  );
  const maxCode = result[0].maxCode || 0;
  const nextCode = (maxCode + 1).toString().padStart(3, "0");
  return `DP${nextCode}`;
};

router.get("/nextdepartmentcode", async (req, res) => {
  try {
    const nextDepartmentCode = await getNextDepartmentCode();
    res.json({ DpCode: nextDepartmentCode });
  } catch (error) {
    console.error("Error generating next Department code:", error);
    res.status(500).json({ error: "Error generating next Department code" });
  }
});

//fatch department
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM department ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //department remove
  router.delete("/removedepartment/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM department WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  //create Department
  router.post("/createdepartment", async(req, res) => {
    try{
      const DpCode = await getNextDepartmentCode()
    const { departmentName } = req.body;
  
    const sqlInsert = "INSERT INTO department (dpcode, departmentName) VALUES(?, ?)";
  
    db.query(sqlInsert, [DpCode, departmentName]);
    res.status(200).send("department Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
  });
  
  //Department details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM department WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: "Department not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 
  
  //Department details update
  router.put("/updatedepartment/:id", async(req, res)=>{
    const{id}= req.params;
    const{dpcode,departmentName }= req.body
    const sqlUpdate = "UPDATE department SET dpcode = ?, departmentName = ? WHERE id = ?";
    await db.query(sqlUpdate, [dpcode, departmentName,  id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;