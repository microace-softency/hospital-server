const express = require("express");
router = express.Router();

const db = require("../db");

//helperfunction crearte registion code
const getNextRegistationCode = async () => {
  const [result] = await db.query(
    "SELECT MAX(CAST(SUBSTRING(rpcode, 3) AS UNSIGNED)) AS maxCode FROM registation"
  );
  const maxCode = result[0].maxCode || 0;
  const nextCode = (maxCode + 1).toString().padStart(3, "0");
  return `RP${nextCode}`;
};

//next registation code create 
router.get("/nexregistationcode", async (req, res) => {
  try {
    const nextRegistationCode = await getNextRegistationCode();
    res.json({ RegistationCode: nextRegistationCode });
  } catch (error) {
    console.error("Error generating next Registation code:", error);
    res.status(500).json({ error: "Error generating next Registation code" });
  }
});

  
  //registation data fatch
  router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM registation ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //crete registation
  router.post("/createregistation", async(req, res) => {
    const RegistationCode = await getNextRegistationCode()
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
      status
    } = req.body;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const currentTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // Format: HH:MM
    const sqlInsert =
      "INSERT INTO registation ( rpcode ,date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber, status ) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
  
    db.query(
      sqlInsert,
      [
        RegistationCode,
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
        status
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
    const{rpcode,date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber, status}= req.body
    const sqlUpdate = "UPDATE registation SET rpcode = ?, date = ?, location = ?, name = ?, image = ?, mobilenumber = ?, sex = ?, age = ?, doctorname = ?, time = ?, type = ?, price = ?, guardianname = ?, guardiannumber = ?, status = ?  WHERE id = ?";
    await db.query(sqlUpdate, [rpcode, date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber, status, id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;
