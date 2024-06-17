const express = require("express");
router = express.Router();
const db = require("../db");

const getNextStaffCode = async () => {
  const [result] = await db.query("SELECT MAX(CAST(SUBSTRING(scode, 3) AS UNSIGNED)) AS maxCode FROM staff");
  const maxCode = result[0].maxCode || 0; 
  const nextCode = (maxCode + 1).toString().padStart(3, '0');
  return `ST${nextCode}`;
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
  router.delete("/deletestaff/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM staff_additional_fields WHERE staff_id = ?`, [id]);
        await db.query(`DELETE FROM staff WHERE id = ?`, [id]);
        res.status(200).send("Staff Deleted Successfully");
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).send("Error deleting data from the database");
    }
});
  
  //create staff
  router.post("/createstaff", async (req, res) => {
    try {
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
  
      const sqlInsertStaff =
        `INSERT INTO staff (
           scode, name, degicnation, department, pf, esi, aadharcard, pancard
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
      const [staffResult] = await db.query(
        sqlInsertStaff,
        [scode, name, degicnation, department, pf, esi, aadharcard, pancard]
      );
  
      const staffId = staffResult.insertId;
  
      const additionalFieldsPromises = additionalfield.map(field => {
        return db.query(
          `INSERT INTO staff_additional_fields (staff_id, field_name, field_value) VALUES (?, ?, ?)`,
          [staffId, field.testname, field.result]
        );
      });
  
      await Promise.all(additionalFieldsPromises);
  
      res.status(200).send("Staff Created");
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).send("Error inserting data into database");
    }
  });
  
  //staff details view
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const [staffResult] = await db.query(`SELECT * FROM staff WHERE id = ?`, [id]);
      const [additionalFieldsResult] = await db.query(`SELECT field_name AS testname, field_value AS result FROM staff_additional_fields WHERE staff_id = ?`, [id]);
  
      if (staffResult.length === 0) {
        return res.status(404).send("Staff not found");
      }
  
      const staffData = staffResult[0];
      staffData.additionalfield = additionalFieldsResult;
  
      res.status(200).json(staffData);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Error fetching data from the database");
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