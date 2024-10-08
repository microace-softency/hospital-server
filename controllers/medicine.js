const express = require("express");
const router = express.Router();
const db = require("../db");

// Helper function to generate a unique product code
const getNextProductCode = async () => {
  const [result] = await db.query("SELECT MAX(CAST(SUBSTRING(productcode, 4) AS UNSIGNED)) AS maxCode FROM productmaster");
  const maxCode = result[0].maxCode || 0; 
  const nextCode = (maxCode + 1).toString().padStart(3, '0');
  return `PRO${nextCode}`;
};

router.get("/nextproductcode", async (req, res) => {
  try {
    const nextProductCode = await getNextProductCode();
    res.json({ productCode: nextProductCode });
  } catch (error) {
    console.error("Error generating next product code:", error);
    res.status(500).json({ error: "Error generating next product code" });
  }
});

// Fetch data
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM productmaster ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

// Product remove
router.delete("/removeproduct/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM productmaster WHERE id = ?";
  db.query(sqlRemove, [id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error deleting product");
    } else {
      res.send("Product removed successfully");
    }
  });
});

// Create product
router.post("/createproduct", async (req, res) => {
  try {
    const productCode = await getNextProductCode();
    const {
      Description,
      purchesunit,
      Stock,
      sale,
      hsnsaccode,
      productgroup,
      productsubgroup,
      taxcategory,
      salerate,
      buyrate,
      opening,
      expdate,
      batchnumber,
      lancecode,
      hasBatchNumber,
    } = req.body;

    const sqlInsert = `
      INSERT INTO productmaster (
        productcode, Description, purchesunit, Stock, sale, hsnsaccode, productgroup, productsubgroup, taxcategory, salerate, buyrate, opening, expdate, batchnumber,lancecode, hasBatchNumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sqlInsert, [
      productCode,
      Description,
      purchesunit,
      Stock,
      sale,
      hsnsaccode,
      productgroup,
      productsubgroup,
      taxcategory,
      salerate,
      buyrate,
      opening,
      expdate,
      batchnumber,
      lancecode,
      hasBatchNumber, 
    ]);

    res.status(200).send("Product created successfully with Product Code: " + productCode);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

// Product details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM productmaster WHERE id = ?";

  try {
    const [result] = await db.query(sqlGet, [id]);

    if (result.length === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Product details update
router.put("/updateproduct/:id", async (req, res) => {
  const { id } = req.params;
  const {
    productcode,
    Description,
    purchesunit,
    Stock,
    sale,
    hsnsaccode,
    productgroup,
    productsubgroup,
    taxcategory,
    salerate,
    buyrate,
    opening,
    expdate,
    batchnumber,
    lancecode,
    hasBatchNumber, 
  } = req.body;

  const sqlUpdate = `
    UPDATE productmaster 
    SET productcode = ?, Description = ?, purchesunit = ?, Stock = ?, sale = ?, hsnsaccode = ?, productgroup = ?, productsubgroup = ?, taxcategory = ?, salerate = ?, buyrate = ?, opening = ?, expdate = ?, batchnumber = ?, lancecode = ?, hasBatchNumber = ? 
    WHERE id = ?`;

  try {
    await db.query(sqlUpdate, [
      productcode,
      Description,
      purchesunit,
      Stock,
      sale,
      hsnsaccode,
      productgroup,
      productsubgroup,
      taxcategory,
      salerate,
      buyrate,
      opening,
      expdate,
      batchnumber,
      lancecode,
      hasBatchNumber,
      id,
    ]);
    res.send("Product updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating product");
  }
});

app.put('/:id/update-stock', async (req, res) => {
  const productId = req.params.id;
  const { opening } = req.body;

  try {
    await db.query(
      'UPDATE productmaster SET opening = ? WHERE id = ?',
      [opening, productId]
    );
    res.status(200).json({ message: 'opening updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update opening' });
  }
});



module.exports = router;
