const express = require("express");
router = express.Router();

const db = require("../../db");

//fatch Voucher
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM VendorVoucher ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//Voucher remove
router.delete("/removevoucher/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM VendorVoucher WHERE id = ?";
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
      VENCODE,
      DESCRIPT,
      CBNAME,
      NARRATION,
      PAYEE_R,
      CHEQUE_ON,
      CHEQUE_NO,
      CHEQUE_DT,
      AMOUNT,
    } = req.body;

    const sqlInsert =
      "INSERT INTO VendorVoucher (TYPE, TRNNO, TRN_DATE, VENCODE,DESCRIPT, CBNAME,NARRATION, PAYEE_R,CHEQUE_ON,CHEQUE_NO, CHEQUE_DT, AMOUNT) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(sqlInsert, [
      TYPE,
      TRNNO,
      TRN_DATE,
      VENCODE,
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

//Vouchers details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM VendorVoucher WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "vouchers not found" });
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
    VENCODE,
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
    "UPDATE VendorVoucher SET TYPE = ?, TRNNO = ?, TRN_DATE = ?, VENCODE = ?, DESCRIPT = ?, CBNAME = ?, NARRATION = ?, PAYEE_R = ?, CHEQUE_ON = ?, CHEQUE_NO = ?, CHEQUE_DT = ?, AMOUNT = ?  WHERE id = ?";
  await db.query(
    sqlUpdate,
    [
      TYPE,
      TRNNO,
      TRN_DATE,
      VENCODE,
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
