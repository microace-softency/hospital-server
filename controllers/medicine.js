const express = require("express");
router = express.Router();

const db = require("../db");
//fatch data
router.get("/", async (req, res) => {
    await db
      .query("SELECT * FROM productmaster ")
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });
  
  //PRODUCT remove
  router.delete("/removeproduct/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM productmaster WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  
  //create product
  router.post("/createproduct", (req, res) => {
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
      purchasedate,
      batchnumber
    } = req.body;
  
    const sqlInsert =
      "INSERT INTO productmaster ( Description, purchesunit, Stock, sale, hsnsaccode, productgroup, productsubgroup, taxcategory, salerate, buyrate, opening, expdate, purchasedate, batchnumber) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
    db.query(
      sqlInsert,
      [
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
        purchasedate,
        batchnumber
      ],
      (error, result) => {
        if (error) {
          console.error("Error inserting data:", error);
          res.status(500).send("Error inserting data into database");
        } else {
          console.log("Data inserted successfully");
          res.status(200).send("Doctor Created");
        }
      }
    );
  });
  
  //product details view
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM productmaster WHERE id = ?";
  
    try {
      const result = await db.query(sqlGet, id);
  
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
  
  //product details update
  router.put("/updateproduct/:id", async(req, res)=>{
    const{id}= req.params;
    const{Description, purchesunit, Stock, sale, hsnsaccode, productgroup, productsubgroup, taxcategory, salerate, buyrate, opening, expdate, purchasedate, batchnumber }= req.body
    const sqlUpdate = "UPDATE productmaster SET Description = ?, purchesunit = ?, Stock = ?, sale = ?, hsnsaccode = ?, productgroup = ?, productsubgroup = ?, taxcategory = ?, salerate = ?, buyrate = ?, opening = ?, expdate = ?, purchasedate = ?, batchnumber = ? WHERE id = ?";
    await db.query(sqlUpdate, [Description, purchesunit, Stock, sale, hsnsaccode, productgroup, productsubgroup, taxcategory, salerate, buyrate, opening, expdate, purchasedate, batchnumber , id], (error, result ) =>{
      if (error) {
        console.log(error);
      }
      res.send(result)
    })
  });

module.exports = router;