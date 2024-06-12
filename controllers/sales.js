const express = require("express");
const router = express.Router();
const db = require("../db");

//create sales
router.post("/create", async (req, res) => {
  const {
    BillNo,
    BillDate,
    CustCode,
    CustName,
    PaymentMode,
    AdvancePayment,
    DuePayment,
    items
  } = req.body;

  const sqlInsertSale = `
    INSERT INTO bill (BillNo, BillDate, CustCode, CustName, PaymentMode, AdvancePayment, DuePayment)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const sqlInsertItem = `
    INSERT INTO Sales_item (billId, itemCode, description, quantity, uom, rate, productTotal, discount, taxableAmount, gstrRate, gstAmount, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const connection = await db.getConnection(); // Get a connection from the pool
  await connection.beginTransaction(); // Start a new transaction

  try {
    const [saleResult] = await connection.query(sqlInsertSale, [
      BillNo,
      BillDate,
      CustCode,
      CustName,
      PaymentMode,
      AdvancePayment,
      DuePayment
    ]);

    const billId = saleResult.insertId;

    for (const item of items) {
      await connection.query(sqlInsertItem, [
        billId,
        item.ItemCode,
        item.Description,
        item.Quantity,
        item.UOM,
        item.Rate,
        item.ProductTotal,
        item.Discount,
        item.TaxableAmount,
        item.GSTRate,
        item.GSTAmount,
        item.Amount
      ]);
    }

    await connection.commit(); // Commit the transaction
    res.status(200).send("Sale Created");
  } catch (error) {
    await connection.rollback(); // Rollback the transaction in case of error
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

//get sales data
router.get("/", async (req, res) => {
    try {
      const [data] = await db.query("SELECT * FROM bill");
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching data from database");
    }
  });

  // View a sale by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const [[sale]] = await db.query("SELECT * FROM bill WHERE id = ?", [id]);
      if (!sale) {
        return res.status(404).send("Sale not found");
      }
  
      const [items] = await db.query("SELECT * FROM Sales_item WHERE BillId = ?", [id]);
  
      res.send({ ...sale, items });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching data from database");
    }
  });
  
  // Remove a sale by ID
  router.delete("/sales/:id", async (req, res) => {
    const { id } = req.params;
  
    const sqlRemoveItems = "DELETE FROM Sales_item WHERE BillId = ?";
    const sqlRemoveSale = "DELETE FROM bill WHERE BillId = ?";
  
    const connection = await db.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start a new transaction
  
    try {
      await connection.query(sqlRemoveItems, [id]); // Remove related items first
      await connection.query(sqlRemoveSale, [id]); // Then remove the sale
  
      await connection.commit(); // Commit the transaction
      res.status(200).send("Sale deleted");
    } catch (error) {
      await connection.rollback(); // Rollback the transaction in case of error
      console.error("Error deleting data:", error);
      res.status(500).send("Error deleting data");
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  });
  
module.exports = router;
