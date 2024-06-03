const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch purchases data
router.get("/", async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM purchase");
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data from database");
  }
});

// Create purchase
router.post("/createpurches", async (req, res) => {
  const {
    PurchaseInvNo,
    InvDate,
    PartyInvNo,
    PurchaseInvDate,
    VendorCode,
    VendorName,
    items
  } = req.body;

  const sqlInsertPurchase = `
    INSERT INTO purchase (PurchaseInvNo, InvDate, PartyInvNo, PurchaseInvDate, VendorCode, VendorName)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const sqlInsertItem = `
    INSERT INTO purchase_items (PurchaseID, ItemCode, Description, Quantity, UOM, Rate, ProductTotal, GSTRate, GSTAmount, Amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const connection = await db.getConnection(); // Get a connection from the pool
  await connection.beginTransaction(); // Start a new transaction

  try {
    const [purchaseResult] = await connection.query(sqlInsertPurchase, [
      PurchaseInvNo,
      InvDate,
      PartyInvNo,
      PurchaseInvDate,
      VendorCode,
      VendorName
    ]);

    const purchaseId = purchaseResult.insertId;

    for (const item of items) {
      await connection.query(sqlInsertItem, [
        purchaseId,
        item.ItemCode,
        item.Description,
        item.Quantity,
        item.UOM,
        item.Rate,
        item.ProductTotal,
        item.GSTRate,
        item.GSTAmount,
        item.Amount
      ]);
    }

    await connection.commit(); // Commit the transaction
    res.status(200).send("Purchase Created");
  } catch (error) {
    await connection.rollback(); // Rollback the transaction in case of error
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

// view purchase data by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [[purchase]] = await db.query("SELECT * FROM purchase WHERE PurchaseID = ?", [id]);
    if (!purchase) {
      return res.status(404).send("Purchase not found");
    }

    const [items] = await db.query("SELECT * FROM purchase_items WHERE PurchaseID = ?", [id]);

    res.send({ ...purchase, items });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data from database");
  }
});

// Remove purchase
router.delete("/removepurches/:id", async (req, res) => {
  const { id } = req.params;

  const sqlRemoveItems = "DELETE FROM purchase_items WHERE PurchaseID = ?";
  const sqlRemovePurchase = "DELETE FROM purchase WHERE PurchaseID = ?";

  const connection = await db.getConnection(); // Get a connection from the pool
  await connection.beginTransaction(); // Start a new transaction

  try {
    await connection.query(sqlRemoveItems, [id]); // Remove related items first
    await connection.query(sqlRemovePurchase, [id]); // Then remove the purchase

    await connection.commit(); // Commit the transaction
    res.status(200).send("Purchase deleted");
  } catch (error) {
    await connection.rollback(); // Rollback the transaction in case of error
    console.error("Error deleting data:", error);
    res.status(500).send("Error deleting data");
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = router;
