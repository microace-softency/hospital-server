const express = require("express");
router = express.Router();

const db = require('../../db');

// const getNextBedCode = async () => {
//   const [result] = await db.query(
//     "SELECT MAX(CAST(SUBSTRING(bedcode, 3) AS UNSIGNED)) AS maxCode FROM bed"
//   );
//   const maxCode = result[0].maxCode || 0;
//   const nextCode = (maxCode + 1).toString().padStart(3, "0");
//   return `BC${nextCode}`;
// };

// router.get("/nextbedcode", async (req, res) => {
//   try {
//     const nextBedCode = await getNextBedCode();
//     res.json({ BedCode: nextBedCode });
//   } catch (error) {
//     console.error("Error generating next Bed code:", error);
//     res.status(500).json({ error: "Error generating next Bed code" });
//   }
// });

//fatch Voucher
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM customerVoucher")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//Voucher remove
router.delete("/removevoucher/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM customerVoucher WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create Voucher
router.post("/createvoucher", async (req, res) => {
  try {
    const {
      TYPE,
      TRNNO,
      TRN_DATE,
      CUSTCODE,
      DESCRIPT,
      CBNAME,
      NARRATION,
      PAYEE_R,
      CHEQUE_ON,
      CHEQUE_NO,
      CHEQUE_DT,
      AMOUNT,
    } = req.body;
console.log("req.body", req.body);

    const sqlInsert =
      "INSERT INTO customerVoucher (TYPE, TRNNO, TRN_DATE, CUSTCODE,DESCRIPT, CBNAME,NARRATION, PAYEE_R,CHEQUE_ON,CHEQUE_NO, CHEQUE_DT, AMOUNT) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(sqlInsert, [
      TYPE,
      TRNNO,
      TRN_DATE,
      CUSTCODE,
      DESCRIPT,
      CBNAME,
      NARRATION,
      PAYEE_R,
      CHEQUE_ON,
      CHEQUE_NO,
      CHEQUE_DT,
      AMOUNT,
    ]);
    res.status(200).send("Voucher Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

//customerVoucher details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM customerVoucher WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "customerVoucher not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Voucher details update
router.put("/updatevoucher/:id", async (req, res) => {
  const { id } = req.params;
  const {
    TYPE,
    TRNNO,
    TRN_DATE,
    CUSTCODE,
    DESCRIPT,
    CBNAME,
    NARRATION,
    PAYEE_R,
    CHEQUE_ON,
    CHEQUE_NO,
    CHEQUE_DT,
    AMOUNT
  } = req.body;
  
  const sqlUpdate =
    "UPDATE customerVoucher SET TYPE = ?, TRNNO = ?, TRN_DATE = ?, CUSTCODE = ?, DESCRIPT = ?, CBNAME = ?, NARRATION = ?, PAYEE_R = ?, CHEQUE_ON = ?, CHEQUE_NO = ?, CHEQUE_DT = ?, AMOUNT = ?  WHERE id = ?";
  await db.query(
    sqlUpdate,
    [
      TYPE,
      TRNNO,
      TRN_DATE,
      CUSTCODE,
      DESCRIPT,
      CBNAME,
      NARRATION,
      PAYEE_R,
      CHEQUE_ON,
      CHEQUE_NO,
      CHEQUE_DT,
      AMOUNT,
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

module.exports = router;
