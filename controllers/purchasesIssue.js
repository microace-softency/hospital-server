const express = require("express");
const router = express.Router();
const db = require("../db");

// Create a new purchase issue
router.post('/create', (req, res) => {
    const { PurchaseIssueNo, IssueDate, department, remarks, items } = req.body;

    const itemsJson = JSON.stringify(items);
    const purchaseIssueQuery = 'INSERT INTO purchase_issues (PurchaseIssueNo, IssueDate, department, remarks, items) VALUES (?, ?, ?, ?, ?)';

    db.query(purchaseIssueQuery, [PurchaseIssueNo, IssueDate, department, remarks, itemsJson], (err, result) => {
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        }
        res.status(201).json({ message: 'Purchase issue created successfully' });
    });
});

// purchases issue fatch
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM purchase_issues ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });

   //purchases Issue remove
   router.delete("/remove/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM purchase_issues  WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });


module.exports = router;
