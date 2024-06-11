const express = require("express");
const bodyParser = require("body-parser");
app = express();
const cors = require("cors");

const db = require("./db");
app.use(cors());
app.use(express.json());

const jwt = require("jsonwebtoken");
app.use(bodyParser.json());

const bcrypt = require("bcrypt");

doctorRoutes = require("./controllers/doctor");
testRoutes = require("./controllers/test");
registationRoutes = require("./controllers/registation");
locationRoutes = require("./controllers/location");
packageRoutes = require("./controllers/packeg");
admisionRoutes = require("./controllers/admision");
pathologyRoutes = require("./controllers/pathology");
bedRoutes = require("./controllers/bed");
departmentRoutes = require("./controllers/department");
medicineRoutes = require("./controllers/medicine");
staffRoutes = require("./controllers/staff");
outdoreUserRoutes = require("./controllers/outdoreUser");
outdoreRegistationRoutes = require("./controllers/outdoreRegistation");
purchaseRoutes = require("./controllers/purchases");
purchaseIssueRoutes = require("./controllers/purchasesIssue");
batchRoutes = require("./controllers/barchNumber");
salesRoutes = require("./controllers/sales");

app.get("/", (req, res) => {
  res.send("hellow");
});

//outdoreuser login
app.post("/api/login", async (req, res) => {
  console.log("request body", req.body);
  try {
    const { email, password } = req.body;

    const results = await db.query(
      "SELECT * FROM outdoreuser WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    // const passwordMatch = await (password ===user.password);
    if (!password === user.password) {
      return res.status(401).json({ message: "Invalid  password" });
    }
    console.log("password", user.password);

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error fetching user:", error); // Log detailed error
    res.status(500).json({ message: "Error fetching user" });
  }
});

//doctor
app.use("/api/doctor", doctorRoutes);

//test
app.use("/api/test", testRoutes);

//registation
app.use("/api/registation", registationRoutes);

//Location
app.use("/api/location", locationRoutes);

//packeg
app.use("/api/packeg", packageRoutes);

//admision
app.use("/api/admission", admisionRoutes);

//pathology
app.use("/api/pathology", pathologyRoutes);

//BED MASTER
app.use("/api/bed", bedRoutes);

//DEPARTMENT MASTER
app.use("/api/department", departmentRoutes);

// Medicine
app.use("/api/product", medicineRoutes);

//STAFF MASTER
app.use("/api/staff", staffRoutes);

//outdoreuser
app.use("/api/outdoreuser", outdoreUserRoutes);

//outdoreregistaion
app.use("/api/outdoreregistation", outdoreRegistationRoutes);

//purches
app.use("/api/purchase", purchaseRoutes);

//purches Issue
app.use("/api/purchaseissue", purchaseIssueRoutes);

//Sales Issue
app.use("/api/sales", salesRoutes);

//batch
app.use("/api/batch", batchRoutes);

const port = process.env.PORT || 8005;

db.query("SELECT 1")
  .then((data) => {
    console.log("db Cpnnection succeeded", data);
    app.listen(port, () => console.log("server started at 8005"));
  })
  .catch((err) => console.log("db connection failed. \n" + err));
