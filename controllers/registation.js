const express = require("express");
router = express.Router();

const db = require("../db");
const mysqlPool = require("../db");

// // Endpoint to get registrations for a specific date
router.get('/registrationreport', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM registation WHERE DATE(createdAt) BETWEEN ? AND ?',
      [startDate, endDate]
    );
    connection.release();

    res.json(rows); // Send the fetched rows (registrations) as JSON response
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
router.get("/nextregistationcode", async (req, res) => {
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

//today registation data fatch
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const query = 'SELECT COUNT(*) AS count FROM registation WHERE DATE(date) = ?';
    const [results] = await db.query(query, [today]);
    res.json(results[0]);
  } catch (error) {
    console.error('Error fetching today\'s registation:', error);
    res.status(500).json({ message: 'Error fetching today\'s registation' });
  }
});

//crete registation
router.post("/createregistation", async (req, res) => {
  try {
    let { rpcode, date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber, status } = req.body;
    // If rpcode is not provided by the frontend, generate it on the backend
    if (!rpcode) {
      rpcode = await getNextRegistationCode();
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const currentTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // Format: HH:MM

    const sqlInsert = `
      INSERT INTO registation 
      (rpcode, date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber, status, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(
      sqlInsert,
      [
        rpcode,
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
        status,
      ],
       res.status(200).json({ message: "Registration Created", id: rpcode })
    );
  } catch (error) {
    console.error("Error in registration creation:", error);
    res.status(500).send("Internal server error");
  }
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
router.put("/updateregistation/:id", async (req, res) => {
  const { id } = req.params;
  const {
    rpcode,
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
    status,
  } = req.body;
  const sqlUpdate =
    "UPDATE registation SET rpcode = ?, date = ?, location = ?, name = ?, image = ?, mobilenumber = ?, sex = ?, age = ?, doctorname = ?, time = ?, type = ?, price = ?, guardianname = ?, guardiannumber = ?, status = ?  WHERE id = ?";
  await db.query(
    sqlUpdate,
    [
      rpcode,
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
      status,
      id,
    ],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    }
  );
});

// Search for patients by key (name or mobilenumber)
// router.get("/search", async (req, res) => {
//   const { name, mobilenumber } = req.query;
//   console.log(req.body);
//   try {
//     const connection = await mysqlPool.getConnection();
//     let query = "SELECT * FROM registation WHERE";
//     const params = [];

//     if (name) {
//       query += " name LIKE ?";
//       params.push(`%${name}%`);
//     }

//     if (mobilenumber) {
//       if (params.length > 0) query += " AND";
//       query += " mobilenumber LIKE ?";
//       params.push(`%${mobilenumber}%`);
//     }

//     if (params.length === 0) {
//       res.status(400).json({ error: "Please provide a search key" });
//       return;
//     }

//     const [rows] = await connection.query(query, params);
//     connection.release();

//     res.json(rows); // Send the fetched rows as JSON response
//   } catch (error) {
//     console.error("Error fetching patients:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


module.exports = router;
