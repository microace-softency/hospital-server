const express = require("express");
router = express.Router();

const db = require("../db");

//fatch purches data
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM purchase ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//create purches
router.post("/createpurches", (req, res) => {
  const {
    PurchaseInvNo,
    InvDate,
    PartyInvNo,
    PurchaseInvDate,
    VendorCode,
    VendorName,
  } = req.body;
  console.log(req.body);
  const sqlInsert =
    "INSERT INTO purchase (  PurchaseInvNo, InvDate, PartyInvNo, PurchaseInvDate, VendorCode, VendorName) VALUES( ?, ?, ?, ?, ?, ?)";

  db.query(
    sqlInsert,
    [
      PurchaseInvNo,
      InvDate,
      PartyInvNo,
      PurchaseInvDate,
      VendorCode,
      VendorName,
    ],
    (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Purchases  Created");
      }
    }
  );
});

//remove pathology user
router.delete("/removepurches/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM purchase WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });

module.exports = router;
