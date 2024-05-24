const express = require("express");
router = express.Router();

const db = require("../db");

const getNextPackegCode = async () => {
  const [result] = await db.query(
    "SELECT MAX(CAST(SUBSTRING(pcode, 3) AS UNSIGNED)) AS maxCode FROM packeg"
  );
  const maxCode = result[0].maxCode || 0;
  const nextCode = (maxCode + 1).toString().padStart(3, "0");
  return `PK${nextCode}`;
};

//fatch packeg
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM packeg ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//remove packeg
router.delete("/removeapackeg/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM packeg WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create packeg
router.post("/createpackeg", async (req, res) => {
  try {
    const PackegCode = await getNextPackegCode();
    const { packegname, packegrate, packegnote } = req.body;

    const sqlInsert = `INSERT INTO packeg 
      (pcode, packegname, packegrate, packegnote ) 
      VALUES( ?, ?, ?, ?)`;

   await db.query(sqlInsert, [PackegCode, packegname, packegrate, packegnote]);
    res.status(200).send("Packeg Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

//packeg details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM packeg WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Packeg not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//packeg details update
router.put("/updatepackeg/:id", async (req, res) => {
  const { id } = req.params;
  const { packegname, packegrate, packegnote } = req.body;
  const sqlUpdate =
    "UPDATE packeg SET packegname = ?, packegrate = ?, packegnote = ? WHERE id = ?";
  await db.query(
    sqlUpdate,
    [packegname, packegrate, packegnote, id],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    }
  );
});

module.exports = router;
