const express = require("express");
router = express.Router();

const db = require("../db");

const getNextAgentCode = async () => {
  const [result] = await db.query(
    "SELECT MAX(CAST(SUBSTRING(agcode, 3) AS UNSIGNED)) AS maxCode FROM agent"
  );
  const maxCode = result[0].maxCode || 0;
  const nextCode = (maxCode + 1).toString().padStart(4, "0");
  return `A${nextCode}`;
};

router.get("/nextagentcode", async (req, res) => {
  try {
    const nextAgentCode = await getNextAgentCode();
    res.json({ AgentCode: nextAgentCode });
  } catch (error) {
    console.error("Error generating next Agent code:", error);
    res.status(500).json({ error: "Error generating next Agent code" });
  }
});

//fatch Agent data
router.get("/", async (req, res) => {
  await db
    .query("SELECT * FROM agent ")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

//create Agent
router.post("/createagent", async (req, res) => {
  try {
    const AgentCode = await getNextAgentCode();
    const { name, mobilenumber, percentage } = req.body;

    const sqlInsert = `INSERT INTO agent (
      agcode, name, mobilenumber	, percentage
      ) VALUES(?, ?, ?, ?)`;

    await db.query(sqlInsert, [AgentCode, name, mobilenumber, percentage]);
    res.status(200).send("Agent Created");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into database");
  }
});

//remove Agent
router.delete("/removeagent/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM agent WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//Agent details view
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM agent WHERE id = ?";

  try {
    const result = await db.query(sqlGet, id);

    if (result.length === 0) {
      res.status(404).json({ error: "Agent not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Agent details update
router.put("/updateagent/:id", async (req, res) => {
  const { id } = req.params;
  const { agcode, name, mobilenumber, percentage } = req.body;
  const sqlUpdate =
    "UPDATE agent SET agcode = ?, name = ?,  mobilenumber = ?, percentage = ?  WHERE id = ?";
  await db.query(
    sqlUpdate,
    [agcode, name, mobilenumber, percentage, id],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    }
  );
});

module.exports = router;
