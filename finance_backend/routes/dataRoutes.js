const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection file

router.get("/financial-data", (req, res) => {
  db.query("SELECT date, price FROM stocks", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
