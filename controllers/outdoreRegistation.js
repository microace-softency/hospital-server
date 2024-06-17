const express = require("express");
router = express.Router();

const db = require("../db");

//helperfunction crearte registion code
const getNextRegistationCode = async () => {
  const [result] = await db.query(
    "SELECT MAX(CAST(SUBSTRING(orpCode, 3) AS UNSIGNED)) AS maxCode FROM outdore_registation"
  );
  const maxCode = result[0].maxCode || 0;
  const nextCode = (maxCode + 1).toString().padStart(3, "0");
  return `ORP${nextCode}`;
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

//fatch data
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM outdore_registation ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //crete Outdore-registation
  router.post("/createoutdoreregistation", async(req, res) => {
    const RegistationCode = await getNextRegistationCode()
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
      "INSERT INTO outdore_registation (  orpCode, date, time, patiantname, address, image, mobilenumber, guardianname, guardiannumber, doctorname, sex, age ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?  )";
  
    db.query(
      sqlInsert,
      [
        RegistationCode,
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

   //Outdore pataint details view
   router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM outdore_registation WHERE id = ?";
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
  
  //OutDoor Registation details update
  router.put("/updateregistation/:id", async(req, res)=>{
    const{id}= req.params;
    const{orpCode,date, address, patiantname, image, mobilenumber, sex, age, doctorname, time, guardianname, guardiannumber}= req.body
    const sqlUpdate = "UPDATE outdore_registation SET orpCode = ?, date = ?, address = ?, patiantname = ?, image = ?, mobilenumber = ?, sex = ?, age = ?, doctorname = ?, time = ?, guardianname = ?, guardiannumber = ?  WHERE id = ?";
    await db.query(sqlUpdate, [orpCode, date, address, patiantname, image, mobilenumber, sex, age, doctorname, time, guardianname, guardiannumber, id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;