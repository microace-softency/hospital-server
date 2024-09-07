const express = require("express");
const router = express.Router();
const db = require("../db");

// Create a new transaction
router.post("/create", async (req, res) => {
  const {
    voucher_no,
    date,
    patient_id,
    name,
    particular,
    net_amount,
    received_amount,
    type
  } = req.body;
console.log(req.body);
  try {
    const [result] = await db.query(
      `INSERT INTO trans 
      (voucher_no, date, patient_id, name, particular, net_amount, received_amount, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [voucher_no, date, patient_id, name, particular, net_amount, received_amount, type]
    );

    res.status(201).json({ message: "Transaction created successfully", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create transaction" });
  }
});

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const [transactions] = await db.query("SELECT * FROM trans");
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

// Get a transaction by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [transaction] = await db.query("SELECT * FROM trans WHERE id = ?", [id]);

    if (transaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transaction" });
  }
});

// Update a transaction
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    voucher_no,
    date,
    patient_id,
    name,
    particular,
    net_amount,
    received_amount,
    type
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE trans SET voucher_no = ?, date = ?, patient_id = ?, name = ?, particular = ?, net_amount = ?, received_amount = ?, type = ? WHERE id = ?`,
      [voucher_no, date, patient_id, name, particular, net_amount, received_amount, type, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});

// Delete a transaction
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM trans WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

module.exports = router;
