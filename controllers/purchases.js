// const express = require("express");
// const router = express.Router();
// const db = require("../db");
 
// const getNextPurchasesCode = async () => {
//   const [result] = await db.query(
//     "SELECT MAX(CAST(SUBSTRING(PurchaseInvNo, 3) AS UNSIGNED)) AS maxCode FROM purchase"
//   );
//   const maxCode = result[0].maxCode || 0;
//   const nextCode = (maxCode + 1).toString().padStart(3, "0");
//   return `PR${nextCode}`;
// };

// router.get("/nextpurchasescode", async (req, res) => {
//   try {
//     const nextPurchasesCode = await getNextPurchasesCode();
//     res.json({ PurchasesCode: nextPurchasesCode });
//   } catch (error) {
//     console.error("Error generating next Purchases code:", error);
//     res.status(500).json({ error: "Error generating next Purchases code" });
//   }
// });

// // Fetch purchases data
// router.get("/", async (req, res) => {
//   try {
//     const [data] = await db.query("SELECT * FROM purchase");
//     res.send(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error fetching data from database");
//   }
// });

// // Create purchase
// router.post("/createpurches", async (req, res) => {
//   PurchasesCode = await getNextPurchasesCode()
//   const {
//     InvDate,
//     PartyInvNo,
//     PurchaseInvDate,
//     VendorCode,
//     VendorName,
//     items
//   } = req.body;

//   const sqlInsertPurchase = `
//     INSERT INTO purchase (PurchaseInvNo, InvDate, PartyInvNo, PurchaseInvDate, VendorCode, VendorName)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   const sqlInsertItem = `
//     INSERT INTO purchase_items (PurchaseID, ItemCode, Description, Quantity, UOM, Rate, ProductTotal, GSTRate, GSTAmount, Amount)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const connection = await db.getConnection(); // Get a connection from the pool
//   await connection.beginTransaction(); // Start a new transaction

//   try {
//     const [purchaseResult] = await connection.query(sqlInsertPurchase, [
//       PurchasesCode,
//       InvDate,
//       PartyInvNo,
//       PurchaseInvDate,
//       VendorCode,
//       VendorName
//     ]);

//     const purchaseId = purchaseResult.insertId;
    
//     for (const item of items) {
//       await connection.query(sqlInsertItem, [
//         purchaseId,
//         item.ItemCode,
//         item.Description,
//         item.Quantity,
//         item.UOM,
//         item.Rate,
//         item.ProductTotal,
//         item.GSTRate,
//         item.GSTAmount,
//         item.Amount
//       ]);
//     }

//     await connection.commit(); // Commit the transaction
//     res.status(200).send("Purchase Created");
//   } catch (error) {
//     await connection.rollback(); // Rollback the transaction in case of error
//     console.error("Error inserting data:", error);
//     res.status(500).send("Error inserting data into database");
//   } finally {
//     connection.release(); // Release the connection back to the pool
//   }
// });

// // view purchase data by ID
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [[purchase]] = await db.query("SELECT * FROM purchase WHERE PurchaseID = ?", [id]);
//     if (!purchase) {
//       return res.status(404).send("Purchase not found");
//     }

//     const [items] = await db.query("SELECT * FROM purchase_items WHERE PurchaseID = ?", [id]);

//     res.send({ ...purchase, items });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error fetching data from database");
//   }
// });

// // Remove purchase
// router.delete("/removepurches/:id", async (req, res) => {
//   const { id } = req.params;

//   const sqlRemoveItems = "DELETE FROM purchase_items WHERE PurchaseID = ?";
//   const sqlRemovePurchase = "DELETE FROM purchase WHERE PurchaseID = ?";

//   const connection = await db.getConnection(); // Get a connection from the pool
//   await connection.beginTransaction(); // Start a new transaction

//   try {
//     await connection.query(sqlRemoveItems, [id]); // Remove related items first
//     await connection.query(sqlRemovePurchase, [id]); // Then remove the purchase

//     await connection.commit(); // Commit the transaction
//     res.status(200).send("Purchase deleted");
//   } catch (error) {
//     await connection.rollback(); // Rollback the transaction in case of error
//     console.error("Error deleting data:", error);
//     res.status(500).send("Error deleting data");
//   } finally {
//     connection.release(); // Release the connection back to the pool
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const db = require("../db");

// Helper function to get next purchase code
const getNextPurchasesCode = async () => {
  const [result] = await db.query(
    "SELECT MAX(CAST(SUBSTRING(PurchaseInvNo, 3) AS UNSIGNED)) AS maxCode FROM purchase"
  );
  const maxCode = result[0].maxCode || 0;
  const nextCode = (maxCode + 1).toString().padStart(3, "0");
  return `PR${nextCode}`;
};

// Get next purchases code
router.get("/nextpurchasescode", async (req, res) => {
  try {
    const nextPurchasesCode = await getNextPurchasesCode();
    res.json({ PurchasesCode: nextPurchasesCode });
  } catch (error) {
    console.error("Error generating next Purchases code:", error);
    res.status(500).json({ error: "Error generating next Purchases code" });
  }
});

// Fetch all purchases
router.get("/", async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM purchase");
    res.send(data);
  } catch (err) {
    console.error("Error fetching purchases:", err);
    res.status(500).send("Error fetching data from database");
  }
});

// Create purchase and associated batches
router.post("/createpurchase", async (req, res) => {
  const {
    InvDate,
    PartyInvNo,
    PurchaseInvDate,
    VendorCode,
    VendorName,
    items,
  } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const PurchasesCode = await getNextPurchasesCode();

    const [purchaseResult] = await connection.query(
      `
      INSERT INTO purchase (PurchaseInvNo, InvDate, PartyInvNo, PurchaseInvDate, VendorCode, VendorName)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        PurchasesCode,
        InvDate,
        PartyInvNo,
        PurchaseInvDate,
        VendorCode,
        VendorName,
      ]
    );

    const purchaseId = purchaseResult.insertId;

    for (const item of items) {
      await connection.query(
        `
        INSERT INTO purchase_items (PurchaseID, ItemCode, Description, Quantity, UOM, Rate, ProductTotal, GSTRate, GSTAmount, Amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          purchaseId,
          item.ItemCode,
          item.Description,
          item.Quantity,
          item.UOM,
          item.Rate,
          item.ProductTotal,
          item.GSTRate,
          item.GSTAmount,
          item.Amount,
        ]
      );

      if (Array.isArray(item.Batches) && item.Batches.length > 0) {
        for (const batch of item.Batches) {
          const { productCode, batchNumber, mfgDate, expDate, quantity } = batch;


          if (productCode && batchNumber && mfgDate && expDate && quantity) {
            await connection.query(
              `
              INSERT INTO batches (PurchaseID, ProductCode, BatchNumber, ManufacturingDate, ExpiryDate, Quantity)
              VALUES (?, ?, ?, ?, ?, ?)
              `,
              [
                purchaseId,
                productCode,
                batchNumber,
                mfgDate,
                expDate,
                quantity,
              ]
            );
          } else {
            console.error("Batch data missing required fields:", batch);
          }
        }
      }
    }

    await connection.commit();
    res.status(200).send("Purchase Created");
  } catch (error) {
    await connection.rollback();
    console.error("Error creating purchase:", error);
    res.status(500).send("Error creating purchase");
  } finally {
    connection.release();
  }
});

// Fetch purchase by ID with associated items and batches
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch purchase details
    const [[purchase]] = await db.query(
      "SELECT * FROM purchase WHERE PurchaseID = ?",
      [id]
    );
    if (!purchase) {
      return res.status(404).send("Purchase not found");
    }

    // Fetch items related to purchase
    const [items] = await db.query(
      "SELECT * FROM purchase_items WHERE PurchaseID = ?",
      [id]
    );

    // Fetch batches related to purchase
    const [batches] = await db.query(
      "SELECT * FROM batches WHERE PurchaseID = ?",
      [id]
    );

    res.send({ purchase, items, batches });
  } catch (err) {
    console.error("Error fetching purchase:", err);
    res.status(500).send("Error fetching purchase");
  }
});

// Remove purchase by ID
router.delete("/removepurchase/:id", async (req, res) => {
  const { id } = req.params;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Delete items related to purchase
    await connection.query("DELETE FROM purchase_items WHERE PurchaseID = ?", [
      id,
    ]);

    // Delete batches related to purchase
    await connection.query("DELETE FROM batches WHERE PurchaseID = ?", [id]);

    // Delete purchase itself
    await connection.query("DELETE FROM purchase WHERE PurchaseID = ?", [id]);

    await connection.commit();
    res.status(200).send("Purchase deleted");
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting purchase:", error);
    res.status(500).send("Error deleting purchase");
  } finally {
    connection.release();
  }
});

module.exports = router;
