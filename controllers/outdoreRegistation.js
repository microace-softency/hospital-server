const express = require("express");
router = express.Router();

const db = require("../db");

//fatch data
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM outdore_registation ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //crete Outdore-registation
  router.post("/createoutdoreregistation", (req, res) => {
    const {
      date,
      time,
      patiantname,
      address,
      image,
      mobilenumber,
      guardianname,
      guardiannumber,
      doctorname,
      sex,
      age,
    } = req.body;
    // const imageBuffer = Buffer.from(image, 'base64');
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const currentTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // Format: HH:MM
    const sqlInsert =
      "INSERT INTO outdore_registation (  date, time, patiantname, address, image, mobilenumber, guardianname, guardiannumber, doctorname, sex, age ) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?  )";
  
    db.query(
      sqlInsert,
      [
        date,
        time,
        patiantname,
        address,
        image,
        mobilenumber,
        guardianname,
        guardiannumber,
        doctorname,
        sex,
        age,
      ],
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
  
  //remove outdoreregistaion data
  router.delete("/removeoutdoreregistaion/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM outdore_registation WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  

module.exports = router;