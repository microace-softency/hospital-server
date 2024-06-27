const express = require("express");
router = express.Router();

const db = require("../db");

// const getNextDoctorCode = async () => {
//   const [result] = await db.query(
//     "SELECT MAX(CAST(SUBSTRING(dcode, 3) AS UNSIGNED)) AS maxCode FROM doctor"
//   );
//   const maxCode = result[0].maxCode || 0;
//   const nextCode = (maxCode + 1).toString().padStart(3, "0");
//   return `DC${nextCode}`;
// };

// router.get("/nextdoctorcode", async (req, res) => {
//   try {
//     const nextDoctorCode = await getNextDoctorCode();
//     res.json({ DoctorCode: nextDoctorCode });
//   } catch (error) {
//     console.error("Error generating next Doctor code:", error);
//     res.status(500).json({ error: "Error generating next Doctor code" });
//   }
// });

//fatch doctor data
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM GeneralLedger ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//create doctor
router.post("/creategeneralledger", async (req, res) => {
  try {
    const {
      GLCode,
      description,
      PLBSAccount,
      PLBSGroup,
      PLBSSGroup,
      cashBankBook,
      initial,
      opening,
    } = req.body;

    const sqlInsert = `INSERT INTO GeneralLedger (
      GLCode,
      description,
      PLBSAccount,
      PLBSGroup,
      PLBSSGroup,
      cashBankBook,
      initial,
      opening
      ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sqlInsert, [
      GLCode,
      description,
      PLBSAccount,
      PLBSGroup,
      PLBSSGroup,
      cashBankBook,
      initial,
      opening
    ]);
    res.status(200).send("Ledger Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

//remove doctor
router.delete("/removeledger/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM GeneralLedger WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//doctor details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM GeneralLedger WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "GeneralLedger not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// //Doctor details update
router.put("/updateledger/:id", async (req, res) => {
  const { id } = req.params;
  const { 
    GLCode,
    description,
    PLBSAccount,
    PLBSGroup,
    PLBSSGroup,
    cashBankBook,
    initial,
    opening
  } = req.body;
  const sqlUpdate =
    "UPDATE GeneralLedger SET GLCode = ?, description = ?, PLBSAccount = ?, PLBSGroup = ?, PLBSSGroup = ?,  cashBankBook = ?, initial = ?, opening = ? WHERE id = ?";
  await db.query(
    sqlUpdate,
    [
      GLCode,
      description,
      PLBSAccount,
      PLBSGroup,
      PLBSSGroup,
      cashBankBook,
      initial,
      opening,
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
