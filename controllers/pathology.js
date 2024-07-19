const express = require("express");
router = express.Router();

const db = require("../db");

//fatch pathology  user
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM pathology_records ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//fatch IN_HOUSE pathology  user
router.get("/getinhousepathology", async (req, res) => {
  await db
    .query("SELECT * FROM inHouse_pathology_records ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//remove pathology user
router.delete("/removepathology/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM pathology_records WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create pathology
// router.post("/createpathology", (req, res) => {
//   const {
//     patientname,
//     patientnumber,
//     testname,
//     referDrName,
//     totalAmount,
//     advancePayment,
//     duePayment,
//     date,
//   } = req.body;

//   const testnames = testname.map((test) => test.testname);

//   const testnamesString = testnames.join(", ");

//   const sqlInsert =
//     "INSERT INTO pathology (patientname, patientnumber, testname, referDrName, totalAmount, advancePayment, duePayment, date) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

//   db.query(
//     sqlInsert,
//     [
//       patientname,
//       patientnumber,
//       testnamesString,
//       referDrName,
//       totalAmount,
//       advancePayment,
//       duePayment,
//       date,
//     ],
//     (error, result) => {
//       if (error) {
//         console.error("Error inserting data:", error);
//         res.status(500).send("Error inserting data into database");
//       } else {
//         console.log("Data inserted successfully");
//         res.status(200).send("New pathology patient Created");
//       }
//     }
//   );
// });

// Create pathology record
router.post("/createpathology", async (req, res) => {
  try {
  const {
    patientname,
    tests,
    group_tests,
    referDrName,
    totalAmount,
    advancePayment,
    duePayment,
    date,
    patientnumber,
    patientaddress,
    agent,
  } = req.body;

  const query =
    "INSERT INTO pathology_records (patientname, tests, group_tests, referDrName, totalAmount, advancePayment, duePayment, date, patientnumber, patientaddress, agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
 await db.query( query,
    [
      patientname,
      JSON.stringify(tests),
      JSON.stringify(group_tests),
      referDrName,
      totalAmount,
      advancePayment,
      duePayment,
      date,
      patientnumber,
      patientaddress,
      agent,
    ]);
    res.status(200).send("Pathology Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});


// Create IN_HOUSE pathology record
router.post("/inhousecreatepathology", async (req, res) => {
  try {
  const {
    patientname,
    tests,
    referDrName,
    totalAmount,
    advancePayment,
    duePayment,
    date,
    patientnumber,
    patientaddress,
    agent,
  } = req.body;

  const query =
    "INSERT INTO inHouse_pathology_records (patientname, tests, referDrName, totalAmount, advancePayment, duePayment, date, patientnumber, patientaddress, agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
 await db.query( query,
    [
      patientname,
      JSON.stringify(tests),
      referDrName,
      totalAmount,
      advancePayment,
      duePayment,
      date,
      patientnumber,
      patientaddress,
      agent,
    ]);
    res.status(200).send("Pathology Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

//pathology details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM pathology_records WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);
    if (result.length === 0) {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Pathology details update
router.put("/updatepathology/:id", async (req, res) => {
  const { id } = req.params;
  const {
    patientname,
    tests,
    group_tests,
    referDrName,
    totalAmount,
    advancePayment,
    duePayment,
    date,
    patientnumber,
    patientaddress,
    agent,
  } = req.body;

  const sqlUpdate =
    "UPDATE pathology_records SET patientname = ?, tests = ?, group_tests = ?, referDrName = ?, totalAmount = ?, advancePayment = ?, duePayment = ?, date = ?, patientnumber = ?, patientaddress = ?, agent = ? WHERE id = ?";
  
  try {
    const result = await db.query(
      sqlUpdate,
      [
        patientname,
        JSON.stringify(tests),
        JSON.stringify(group_tests),
        referDrName,
        totalAmount,
        advancePayment,
        duePayment,
        date,
        patientnumber,
        patientaddress,
        agent,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.json({ message: "Pathology record updated successfully" });
    }
  } catch (error) {
    console.error("Error updating pathology record:", error);
    res.status(500).json({ error: "Failed to update pathology record" });
  }
});

//pathology details view
router.get("/inhouse/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM inHouse_pathology_records WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);
    if (result.length === 0) {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Pathology details update
router.put("/updateinhousepathology/:id", async (req, res) => {
  const { id } = req.params;
  const {
    patientname,
    tests,
    referDrName,
    totalAmount,
    advancePayment,
    duePayment,
    date,
    patientnumber,
    patientaddress,
    agent,
  } = req.body;

  const sqlUpdate =
    "UPDATE inHouse_pathology_records SET patientname = ?, tests = ?, referDrName = ?, totalAmount = ?, advancePayment = ?, duePayment = ?, date = ?, patientnumber = ?, patientaddress = ?, agent = ? WHERE id = ?";
  
  try {
    const result = await db.query(
      sqlUpdate,
      [
        patientname,
        JSON.stringify(tests),
        referDrName,
        totalAmount,
        advancePayment,
        duePayment,
        date,
        patientnumber,
        patientaddress,
        agent,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.json({ message: "inHouse_pathology_records record updated successfully" });
    }
  } catch (error) {
    console.error("Error updating pathology record:", error);
    res.status(500).json({ error: "Failed to update pathology record" });
  }
});

module.exports = router;
