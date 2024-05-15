const express = require("express");
router = express.Router();

const db = require("../db");

  
  //registation data fatch
  router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM registation ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //crete registation
  router.post("/createregistation", (req, res) => {
    const {
      date,
      location,
      name,
      image,
      mobilenumber,
      sex,
      age,
      doctorname,
      time,
      type,
      price,
      guardianname,
      guardiannumber,
    } = req.body;
    // const imageBuffer = Buffer.from(image, 'base64');
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const currentTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // Format: HH:MM
    const sqlInsert =
      "INSERT INTO registation ( date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber ) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?  )";
  
    db.query(
      sqlInsert,
      [
        date,
        location,
        name,
        image,
        mobilenumber,
        sex,
        age,
        doctorname,
        time,
        type,
        price,
        guardianname,
        guardiannumber,
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
  
  //remove registation
  router.delete("/removeregistation/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM registation WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  //pataint details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM registation WHERE id = ?";
    try {
      const result = await db.query(sqlGet, id);
  
      if (result.length === 0) {
        res.status(404).json({ error: " not found" });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  //Registation details update
  router.put("/updateregistation/:id", async(req, res)=>{
    const{id}= req.params;
    const{date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber}= req.body
    const sqlUpdate = "UPDATE registation SET date = ?, location = ?, name = ?, image = ?, mobilenumber = ?, sex = ?, age = ?, doctorname = ?, time = ?, type = ?, price = ?, guardianname = ?, guardiannumber = ?  WHERE id = ?";
    await db.query(sqlUpdate, [date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber, id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;
