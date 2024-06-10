const express = require("express");
router = express.Router();

const db = require("../db");
const mysqlPool = require("../db");

//helper fuction
const getNextTestCode = async () => {
  const [result] = await db.query(
    "SELECT MAX(CAST(SUBSTRING(tcode, 3) AS UNSIGNED)) AS maxCode FROM test"
  );
  const maxCode = result[0].maxCode || 0;
  const nextCode = (maxCode + 1).toString().padStart(3, "0");
  return `TC${nextCode}`;
};

//fatch test data
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM test ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//remove test data
router.delete("/removetest/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM test WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//create test data
router.post("/createtest", async (req, res) => {
  try {
    const TestCode = await getNextTestCode();
    const { testname, amount, day } = req.body;

    const sqlInsert = `INSERT INTO test ( 
        tcode, testname, amount, day
        ) VALUES (?, ?, ?, ?)`;

    await db.query(sqlInsert, [TestCode, testname, amount, day]);
    res.status(200).send("Test Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

//create Grouptest data
router.post('/creategrouptest', async (req, res) => {
  const { testName, subGroups } = req.body;

  if (!testName || !subGroups) {
    return res.status(400).send("Test name and subgroups are required");
  }

  try {
    const PAmount = subGroups.reduce((acc, subGroup) => acc + parseFloat(subGroup.amount || 0), 0);

    // Insert the main test
    const [testResult] = await mysqlPool.execute(
      "INSERT INTO tests (name, PAmount) VALUES (?, ?)",
      [testName, PAmount]
    );

    const testId = testResult.insertId;

    // Insert each subgroup
    for (const subGroup of subGroups) {
      await mysqlPool.execute(
        "INSERT INTO subgroups (test_id, name, amount) VALUES (?, ?, ?)",
        [testId, subGroup.name, subGroup.amount]
      );
    }

    res.status(201).send("Test created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Get Group tests
router.get('/grouptest', async (req, res) => {
  try {
    const [tests] = await mysqlPool.execute('SELECT * FROM tests');
    const testData = await Promise.all(
      tests.map(async (test) => {
        const [subGroups] = await mysqlPool.execute(
          'SELECT * FROM subgroups WHERE test_id = ?',
          [test.id]
        );
        return { ...test, subGroups };
      })
    );
    res.status(200).json(testData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Delete test by ID
router.delete("/removegrouptest/:id", async (req, res) => {
  const { id } = req.params;

  const sqlRemoveSubGroups = "DELETE FROM subgroups WHERE test_id = ?";
  const sqlRemoveTest = "DELETE FROM tests WHERE id = ?";

  const connection = await mysqlPool.getConnection(); // Get a connection from the pool
  await connection.beginTransaction(); // Start a new transaction

  try {
    await connection.query(sqlRemoveSubGroups, [id]); // Remove related subgroups first
    await connection.query(sqlRemoveTest, [id]); // Then remove the test

    await connection.commit(); // Commit the transaction
    res.status(200).send("Test and associated subgroups deleted successfully");
  } catch (error) {
    await connection.rollback(); // Rollback the transaction in case of error
    console.error("Error deleting test data:", error);
    res.status(500).send("Error deleting test data");
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

//Test details view
router.get("/:id", async (req, res) => {
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
router.put("/updatetest/:id", async (req, res) => {
  const { id } = req.params;
  const { testname, amount, day } = req.body;
  const sqlUpdate =
    "UPDATE test SET testname = ?, amount = ?, day = ?  WHERE id = ?";
  await db.query(sqlUpdate, [testname, amount, day, id], (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

module.exports = router;  
