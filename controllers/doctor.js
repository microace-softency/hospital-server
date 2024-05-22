const express = require("express");
router = express.Router();

const db = require("../db");

//fatch doctor data
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM doctor ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//create doctor
router.post("/createdoctor", (req, res) => {
  const {dcode, doctorname, designation, fees, percentage } = req.body;

  const sqlInsert =
    "INSERT INTO doctor (dcode, doctorname,designation,fees, percentage) VALUES(?, ?, ?, ?)";

  db.query(
    sqlInsert,
    [dcode, doctorname, designation, fees, percentage],
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

//book doctor
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
  const { dcode, doctorname, designation, fees, percentage } = req.body;
  const sqlUpdate =
    "UPDATE doctor SET dcode = ?, doctorname = ?, designation = ?, fees = ?, percentage = ?  WHERE id = ?";
  await db.query(
    sqlUpdate,
    [dcode, doctorname, designation, fees, percentage, id],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    }
  );
});

module.exports = router;
