const express = require("express");
const bodyParser = require('body-parser');
app = express();
const cors = require("cors");

const db = require("./db");
app.use(cors());
app.use(express.json());

const jwt = require('jsonwebtoken');
app.use(bodyParser.json());

const bcrypt = require("bcrypt");

app.get("/", (req, res) => {
  res.send("hellow");
});

app.get("/bed", async (req, res) => {
  try {
    const sqlInsert =
      "INSERT INTO bed ( bedname, type) VALUES('icu1', 'ICU 560beds')";
    const result = await db.query(sqlInsert);
    console.log("result", result);
    res.send("Bed create");
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/product", async (req, res) => {
  try {
    const sqlInsert =
      "INSERT INTO productmaster (  Description, purchesunit, Stock, sale, hsnsaccode , productgroup, productsubgroup, taxcategory) VALUES('peracitamal', '8 unit', '500', 'sales', 'p/a58', 'A', 'aaa', 'gst')";
    const result = await db.query(sqlInsert);
    console.log("result", result);
    res.send("product create successfully");
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Internal Server Error");
  }
});


//fatch data
app.get("/api/appointment", async (req, res) => {
  await db
    .query("SELECT * FROM appointment ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

// create appointment data
app.post("/api/createappointment", (req, res) => {
  const {
    mobilenumber,
    name,
    location,
    age,
    symptomsdescription,
    durationofsymptoms,
    medicalhistory,
    medications,
    allergies,
    previoustreatments,
    frequencyandintensity,
    associatedfactors,
    emergencycontactname,
    emergencycontactphone,
    additionalcomments,
  } = req.body;

  const sqlInsert =
    "INSERT INTO appointment (mobilenumber, name, location, age, symptomsdescription, durationofsymptoms, medicalhistory, medications, allergies, previoustreatments, frequencyandintensity, associatedfactors, emergencycontactname, emergencycontactphone, additionalcomments) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sqlInsert,
    [
      mobilenumber,
      name,
      location,
      age,
      symptomsdescription,
      durationofsymptoms,
      medicalhistory,
      medications,
      allergies,
      previoustreatments,
      frequencyandintensity,
      associatedfactors,
      emergencycontactname,
      emergencycontactphone,
      additionalcomments,
    ],
    (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Appointment Created");
      }
    }
  );
});

//book remove
app.delete("/api/removeappointment/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM appointment WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//doctor master

app.get("/location", async (req, res) => {
  try {
    const sqlInsert =
      "INSERT INTO location ( address, district, pincode, pos, postoffice) VALUES('laketown west', 'North 14 PGS', '743154', 'jatia', 'kanchrapara')";
    const result = await db.query(sqlInsert);
    console.log("result", result);
    res.send("Appointment Booked");
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Internal Server Error");
  }
});
//----------------doctor----------------------//

//fatch doctor data
app.get("/api/doctor", async (req, res) => {
  await db
    .query("SELECT * FROM doctor ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});
//create doctor
app.post("/api/createdoctor", (req, res) => {
  const { doctorname, designation, fees, percentage } = req.body;

  const sqlInsert =
    "INSERT INTO doctor (doctorname,designation,fees, percentage) VALUES(?, ?, ?, ?)";

  db.query(
    sqlInsert,
    [doctorname, designation, fees, percentage],
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

//book doctor
app.delete("/api/removedoctor/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM doctor WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//doctor details view
app.get("/api/doctor/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM doctor WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Doctor not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 

//Doctor details update
app.put("/api/updatedoctor/:id", async(req, res)=>{
  const{id}= req.params;
  const{doctorname,designation,fees, percentage}= req.body
  const sqlUpdate = "UPDATE doctor SET doctorname = ?,designation = ?,fees = ?, percentage = ?  WHERE id = ?";
  await db.query(sqlUpdate, [doctorname,designation,fees, percentage, id], (error, result ) =>{
    if (error) {
      console.log(error);
    }
    res.send(result)
  })
});

//------------------test---------------------//

//fatch test data
app.get("/api/test", async (req, res) => {
  await db
    .query("SELECT * FROM test ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//remove test data
app.delete("/api/removetest/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM test WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create test data
app.post("/api/createtest", (req, res) => {
  const { testname, amount, day } = req.body;

  const sqlInsert =
    "INSERT INTO test (  testname, amount, day) VALUES(?, ?, ?)";

  db.query(sqlInsert, [testname, amount, day], (error, result) => {
    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).send("Error inserting data into database");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("Test Created");
    }
  });
});

//Test details view
app.get("/api/test/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM test WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Test not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 

//Test details update
app.put("/api/updatetest/:id", async(req, res)=>{
  const{id}= req.params;
  const{testname, amount, day}= req.body
  const sqlUpdate = "UPDATE test SET testname = ?, amount = ?, day = ?  WHERE id = ?";
  await db.query(sqlUpdate, [testname, amount, day, id], (error, result ) =>{
    if (error) {
      console.log(error);
    }
    res.send(result)
  })
});

//=======================registation=================================\\

//get registation
app.get("/registation", async (req, res) => {
  try {
    const date = new Date("04/03/2024");
    const formattedDate = date.toISOString().split("T")[0];

    const sqlInsert =
      "INSERT INTO registation (date, location, name, image, mobilenumber, sex, age, doctorname, doctordesignation, time, type, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIME() now(), ?, ?)";

    const result = await db.query(sqlInsert, [
      formattedDate,
      "kanchrapara",
      "rahul",
      "none",
      "8569314558",
      "M",
      "26",
      "Dr.prasanto",
      "cardiologist",
      "10:25",
      "general",
      "100",
    ]);

    console.log("result", result);
    res.send("Registration succeeded");
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Internal Server Error");
  }
});

//registation data fatch
app.get("/api/registation", async (req, res) => {
  await db
    .query("SELECT * FROM registation ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//crete registation
app.post("/api/createregistation", (req, res) => {
  const {
    date,
    location,
    name,
    image,
    mobilenumber,
    sex,
    age,
    doctorname,
    time,
    type,
    price,
    guardianname,
    guardiannumber,
  } = req.body;
  // const imageBuffer = Buffer.from(image, 'base64');

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const currentTime = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Format: HH:MM
  const sqlInsert =
    "INSERT INTO registation ( date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber ) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?  )";

  db.query(
    sqlInsert,
    [
      date,
      location,
      name,
      image,
      mobilenumber,
      sex,
      age,
      doctorname,
      time,
      type,
      price,
      guardianname,
      guardiannumber,
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

//remove registation
app.delete("/api/removeregistation/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM registation WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//pataint details view
app.get("/api/registation/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM registation WHERE id = ?";
  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: " not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Registation details update
app.put("/api/updateregistation/:id", async(req, res)=>{
  const{id}= req.params;
  const{date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber}= req.body
  const sqlUpdate = "UPDATE registation SET date = ?, location = ?, name = ?, image = ?, mobilenumber = ?, sex = ?, age = ?, doctorname = ?, time = ?, type = ?, price = ?, guardianname = ?, guardiannumber = ?  WHERE id = ?";
  await db.query(sqlUpdate, [date, location, name, image, mobilenumber, sex, age, doctorname, time, type, price, guardianname, guardiannumber, id], (error, result ) =>{
    if (error) {
      console.log(error);
    }
    res.send(result)
  })
});

//=======================Location=================================\\

//fatch location data
app.get("/api/location", async (req, res) => {
  await db
    .query("SELECT * FROM location ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//crete location
app.post("/api/createlocation", (req, res) => {
  const { address, district, pincode, pos, postoffice } = req.body;

  const sqlInsert =
    "INSERT INTO location ( address, district, pincode, pos, postoffice) VALUES(?, ?, ?, ?, ?)";

  db.query(
    sqlInsert,
    [address, district, pincode, pos, postoffice],
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

//location remove
app.delete("/api/removelocation/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM location WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//location details view
app.get("/api/location/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM location WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Location not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 

//location details update
app.put("/api/updatelocation/:id", async(req, res)=>{
  const{id}= req.params;
  const{address, district, pincode, pos, postoffice}= req.body
  const sqlUpdate = "UPDATE location SET address = ?, district = ?, pincode = ?, pos = ?, postoffice = ?  WHERE id = ?";
  await db.query(sqlUpdate, [address, district, pincode, pos, postoffice, id], (error, result ) =>{
    if (error) {
      console.log(error);
    }
    res.send(result)
  })
});
//--------------------packeg---------------------//

//fatch packeg
app.get("/api/packeg", async (req, res) => {
  await db
    .query("SELECT * FROM packeg ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});
//remove packeg
app.delete("/api/removeapackeg/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM packeg WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create packeg
app.post("/api/createpackeg", (req, res) => {
  const { packegname, packegrate, packegnote } = req.body;

  const sqlInsert =
    "INSERT INTO registation (packegname, packegrate, packegnote ) VALUES( ?, ?, ? )";

  db.query(sqlInsert, [packegname, packegrate, packegnote], (error, result) => {
    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).send("Error inserting data into database");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("Doctor Created");
    }
  });
});


//packeg details view
app.get("/api/packeg/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM packeg WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Packeg not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 

//packeg details update
app.put("/api/updatepackeg/:id", async(req, res)=>{
  const{id}= req.params;
  const{packegname, packegrate, packegnote }= req.body
  const sqlUpdate = "UPDATE packeg SET packegname = ?, packegrate = ?, packegnote = ? WHERE id = ?";
  await db.query(sqlUpdate, [packegname, packegrate, packegnote , id], (error, result ) =>{
    if (error) {
      console.log(error);
    }
    res.send(result)
  })
});


///---------------outdoreuser----------------------//

//fatch outdore user
app.get("/api/outdoreuser", async (req, res) => {
  await db
    .query("SELECT * FROM outdoreuser ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//create outdore user
// app.post("/api/createoutdoreuser", (req, res) => {
//   const { email, password, location } = req.body;

//   const sqlInsert =
//     "INSERT INTO outdoreuser (email, password, location) VALUES(?, ?, ?)";

//   db.query(sqlInsert, [email, password, location], (error, result) => {
//     if (error) {
//       console.error("Error inserting data:", error);
//       res.status(500).send("Error inserting data into database");
//     } else {
//       console.log("Data inserted successfully");
//       res.status(200).send("Doctor Created");
//     }
//   });
// });

app.post('/api/createoutdoreuser', async (req, res) => {
  const { email, password } = req.body;
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into database
  db.query('INSERT INTO outdoreuser (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
    if (err) {
      res.status(500).send('Error registering user');
    } else {
      res.status(201).send('User registered successfully');
    }
  });
});

//outdoreuser remove
app.delete("/api/removeoutdoreuser/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM outdoreuser WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
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

//--------------pathology--------------------------//

//fatch pathology  user
app.get("/api/pathology", async (req, res) => {
  await db
    .query("SELECT * FROM pathology ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//remove pathology user
app.delete("/api/removepathology/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM pathology WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create pathology
app.post("/api/createpathology", (req, res) => {
  const {
    patientname,
    patientnumber,
    testname,
    referDrName,
    totalAmount,
    advancePayment,
    duePayment,
    date,
  } = req.body;

  const testnames = testname.map((test) => test.testname);

  const testnamesString = testnames.join(", ");

  const sqlInsert =
    "INSERT INTO pathology (patientname, patientnumber, testname, referDrName, totalAmount, advancePayment, duePayment, date) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sqlInsert,
    [
      patientname,
      patientnumber,
      testnamesString,
      referDrName,
      totalAmount,
      advancePayment,
      duePayment,
      date,
    ],
    (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("New pathology patient Created");
      }
    }
  );
});

//pathology details view
app.get("/api/pathology/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM pathology WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 

//pathology details update
app.put("/api/updatepathology/:id", async(req, res)=>{
  const{id}= req.params;
  const{patientname, patientnumber, testname, referDrName, totalAmount, advancePayment, duePayment, date }= req.body
  const sqlUpdate = "UPDATE pathology SET patientname = ? , patientnumber = ? , testname = ? , referDrName = ? , totalAmount = ? , advancePayment = ? , duePayment = ? , date = ? WHERE id = ?";
  await db.query(sqlUpdate, [patientname, patientnumber, testname, referDrName, totalAmount, advancePayment, duePayment, date , id], (error, result ) =>{
    if (error) {
      console.log(error);
    }
    res.send(result)
  })
});
//-----------------------outdoreregistaion-----------------------//

//fatch data
app.get("/api/outdoreregistation", async (req, res) => {
  await db
    .query("SELECT * FROM outdore_registation ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//crete Outdore-registation
app.post("/api/createoutdoreregistation", (req, res) => {
  const {
    date,
    time,
    patiantname,
    address,
    image,
    mobilenumber,
    guardianname,
    guardiannumber,
    doctorname,
    sex,
    age,
  } = req.body;
  // const imageBuffer = Buffer.from(image, 'base64');

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const currentTime = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Format: HH:MM
  const sqlInsert =
    "INSERT INTO outdore_registation (  date, time, patiantname, address, image, mobilenumber, guardianname, guardiannumber, doctorname, sex, age ) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?  )";

  db.query(
    sqlInsert,
    [
      date,
      time,
      patiantname,
      address,
      image,
      mobilenumber,
      guardianname,
      guardiannumber,
      doctorname,
      sex,
      age,
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

//remove outdoreregistaion data
app.delete("/api/removeoutdoreregistaion/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM outdore_registation WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//---------------admision-----------------------------------//

//fatch admision  user
app.get("/api/admission", async (req, res) => {
  await db
    .query("SELECT * FROM admissions ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//remove admision user
app.delete("/api/removeadmission/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM admissions WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

// create admision data
app.post("/api/createadmision", (req, res) => {
  const {
    name,
    address,
    mobilenumber,
    pincode,
    block,
    age,
    sex,
    doctor,
    date,
    time,
    guardiannumbaer,
    guardianname,
    bed
  } = req.body;

  const sqlInsert =
    "INSERT INTO admissions (  name, address, mobilenumber, pincode, block, age, sex, doctor, date, time, guardiannumbaer, guardianname, bed) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sqlInsert,
    [
      name,
      address,
      mobilenumber,
      pincode,
      block,
      age,
      sex,
      doctor,
      date,
      time,
      guardiannumbaer,
      guardianname,
      bed
    ],
    (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Admission Created");
      }
    }
  );
});


//Admssion details view
app.get("/api/admission/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM admissions WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Admissions Data not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 

//Admssion details update
app.put("/api/updateadmission/:id", async(req, res)=>{
  const{id}= req.params;
  const{name, address, mobilenumber, pincode, block, age, sex, doctor, date, time, guardiannumbaer, guardianname, bed }= req.body
  const sqlUpdate = "UPDATE admissions SET name = ?, address = ?, mobilenumber = ?, pincode = ?, block = ?, age = ?, sex = ?, doctor = ?, date = ?, time = ?, guardiannumbaer = ?, guardianname = ?, bed = ? WHERE id = ?";
  await db.query(sqlUpdate, [name, address, mobilenumber, pincode, block, age, sex, doctor, date, time, guardiannumbaer, guardianname, bed , id], (error, result ) =>{
    if (error) {
      console.log(error);
    }
    res.send(result)
  })
});
//===================================product==========================================\\

//fatch data
app.get("/api/product", async (req, res) => {
  await db
    .query("SELECT * FROM productmaster ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//PRODUCT remove
app.delete("/api/removeproduct/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM productmaster WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create product
app.post("/api/createproduct", (req, res) => {
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
app.get("/api/product/:id", async (req, res) => {
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
app.put("/api/updateproduct/:id", async(req, res)=>{
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
//  ======================================STAFF MASTER ====================================\\

//fatch staff
app.get("/api/staff", async (req, res) => {
  await db
    .query("SELECT * FROM staff ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//staff remove
app.delete("/api/removestaff/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM staff WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create staff
app.post("/api/createstaff", (req, res) => {
  const {
    name,
    degicnation,
    department,
    pf,
    esi,
    aadharcard,
    pancard,
    additionalfield,
    direction,
  } = req.body;

  const additionalfields = additionalfield.map((field) => field.testname).join(", ");
  const directions = direction.map((dir) => dir.directionName).join(", ");

  const sqlInsert =
  "INSERT INTO staff (name, degicnation, department, pf, esi, aadharcard, pancard, additionalfield, direction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

db.query(
  sqlInsert,
  [
    name,
    degicnation,
    department,
    pf,
    esi,
    aadharcard,
    pancard,
    additionalfields,
    directions,
  ],
    (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("staff  Created");
      }
    }
  );
});

//staff details view
app.get("/api/staff/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM staff WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Staff not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 

//staff details update
app.put("/api/updatestaff/:id", async(req, res)=>{
  const{id}= req.params;
  const{name, degicnation, department, pf, esi, aadharcard, pancard, additionalfield, direction }= req.body
  const sqlUpdate = "UPDATE staff SET name = ? , degicnation = ? , department = ? , pf = ? , esi = ? , aadharcard = ? , pancard = ? , additionalfield = ? , direction = ? WHERE id = ?";
  await db.query(sqlUpdate, [name, degicnation, department, pf, esi, aadharcard, pancard, additionalfield, direction , id], (error, result ) =>{
    if (error) {
      console.log(error);
    }
    res.send(result)
  })
});
//========================================BED MASTER =======================================\\

//fatch bed
app.get("/api/bed", async (req, res) => {
  await db
    .query("SELECT * FROM bed ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//Bed remove
app.delete("/api/removebed/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM bed WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create bed
app.post("/api/createbed", (req, res) => {
  const { bedname, type } = req.body;

  const sqlInsert = "INSERT INTO bed ( bedname, type) VALUES(?, ?)";

  db.query(sqlInsert, [bedname, type], (error, result) => {
    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).send("Error inserting data into database");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("bed  Created");
    }
  });
});


//Bed details view
app.get("/api/bed/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM bed WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Bed not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 

//Bed details update

app.put("/api/updatebed/:id", async(req, res)=>{
  const{id}= req.params;
  const{bedname, type }= req.body
  const sqlUpdate = "UPDATE bed SET bedname = ?, type = ?  WHERE id = ?";
  await db.query(sqlUpdate, [bedname, type,  id], (error, result ) =>{
    if (error) {
      console.log(error);
    }
    res.send(result)
  })
});

app.get("/purchase", async (req, res) => {
  try {
    const sqlInsert =
      "INSERT INTO purchase ( grndate, pono, partyinvno, invdate, rate, vendorcode, vendorname) VALUES('17/04/2024', '6', '26874', '09/03/2023', '532', '963258', 'rum')";
    const result = await db.query(sqlInsert);
    console.log("result", result);
    res.send("purchase successfull");
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Internal Server Error");
  }
});

//=========================================purches=======================================\\

//fatch purches data

app.get("/api/purchase", async (req, res) => {
  await db
    .query("SELECT * FROM purchase ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//create purches
app.post("/api/createpurches", (req, res) => {                            
  const { EntryID, PurchaseInvNo, InvDate, PartyInvNo, EntryType, VendorCode, VendorName } = req.body;
  console.log(req.body);
  const sqlInsert = "INSERT INTO purchaseentry ( EntryID, PurchaseInvNo, InvDate, PartyInvNo, EntryType, VendorCode, VendorName) VALUES(?, ?, ?, ?, ?, ?, ?)";

  db.query(sqlInsert, [EntryID, PurchaseInvNo, InvDate, PartyInvNo, EntryType, VendorCode, VendorName], (error, result) => {
    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).send("Error inserting data into database");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("bed  Created");
    }
  });
});

//=========================================Batch Number=======================================\\


app.post("/api/createbatch", (req, res) => {
  const { inout, docno, productcode, batchno, slno, mfgdate, expdate, qty } = req.body;
  console.log(req.body);
  const sqlInsert = "INSERT INTO whbatch ( `inout`, docno, productcode, batchno, slno, mfgdate, expdate, qty) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sqlInsert, [inout, docno, productcode, batchno, slno, mfgdate, expdate, qty], (error, result) => {
    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).send("Error inserting data into database");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("Batch  Created");
    }
  })
});

db.query("SELECT 1")
  .then((data) => {
    console.log("db Cpnnection succeeded", data);
    app.listen(8005, () => console.log("server started at 8005"));
  })
  .catch((err) => console.log("db connection failed. \n" + err));
