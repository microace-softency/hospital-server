const express = require("express");
router = express.Router();

const db = require("../db");

const getNextDoctorCode = async () => {
  const [result] = await db.query(
    "SELECT MAX(CAST(SUBSTRING(dcode, 3) AS UNSIGNED)) AS maxCode FROM doctor"
  );
  const maxCode = result[0].maxCode || 0;
  const nextCode = (maxCode + 1).toString().padStart(3, "0");
  return `DC${nextCode}`;
};

router.get("/nextdoctorcode", async (req, res) => {
  try {
    const nextDoctorCode = await getNextDoctorCode();
    res.json({ DoctorCode: nextDoctorCode });
  } catch (error) {
    console.error("Error generating next Doctor code:", error);
    res.status(500).json({ error: "Error generating next Doctor code" });
  }
});

//fatch doctor data
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM doctor ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//create doctor
router.post("/createdoctor", async (req, res) => {
  try {
    const DoctorCode = await getNextDoctorCode();
    const {
      doctorname,
      doctorRegistationNo,
      designation,
      onCallFees,
      specialFees,
      generalFees,
      percentage,
      doctorAvailabilityOn,
      doctorSpecialist,
      dateOfJoining,
      doctorNumber,
      remarks,
    } = req.body;

    const sqlInsert = `INSERT INTO doctor (
      dcode,
      doctorname,
      doctorRegistationNo,
      designation,
      onCallFees,
      specialFees,
      generalFees,
      percentage,
      doctorAvailabilityOn,
      doctorSpecialist,
      dateOfJoining,
      doctorNumber,
      remarks
      ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sqlInsert, [
      DoctorCode,
      doctorname,
      doctorRegistationNo,
      designation,
      onCallFees,
      specialFees,
      generalFees,
      percentage,
      doctorAvailabilityOn,
      doctorSpecialist,
      dateOfJoining,
      doctorNumber,
      remarks,
    ]);
    res.status(200).send("Doctor Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

//remove doctor
router.delete("/removedoctor/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM doctor WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//doctor details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM doctor WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Doctor not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Doctor details update
router.put("/updatedoctor/:id", async (req, res) => {
  const { id } = req.params;
  const { 
    dcode,
    doctorname,
    doctorRegistationNo,
    designation,
    onCallFees,
    specialFees,
    generalFees,
    percentage,
    doctorAvailabilityOn,
    doctorSpecialist,
    dateOfJoining,
    doctorNumber,
    remarks
  } = req.body;
  const sqlUpdate =
    "UPDATE doctor SET dcode = ?, doctorname = ?, doctorRegistationNo = ?, designation = ?, onCallFees = ?, specialFees = ?, generalFees = ?, percentage = ?, doctorAvailabilityOn = ?, doctorSpecialist = ?, dateOfJoining = ?, doctorNumber = ?, remarks = ? WHERE id = ?";
  await db.query(
    sqlUpdate,
    [ 
      dcode,
      doctorname,
      doctorRegistationNo,
      designation,
      onCallFees,
      specialFees,
      generalFees,
      percentage,
      doctorAvailabilityOn,
      doctorSpecialist,
      dateOfJoining,
      doctorNumber,
      remarks,
      id
    ],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    }
  );
});

module.exports = router;
