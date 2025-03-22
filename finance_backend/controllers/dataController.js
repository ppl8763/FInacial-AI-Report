const db = require("../config/db");

// ✅ Get All Data
exports.getAllData = (req, res) => {
  db.query("SELECT * FROM financial_data", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Get Data by ID
exports.getDataById = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM financial_data WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// ✅ Add New Data
exports.addData = (req, res) => {
  const { company_name, stock_price, market_cap, revenue, profit } = req.body;
  db.query(
    "INSERT INTO financial_data (company_name, stock_price, market_cap, revenue, profit) VALUES (?, ?, ?, ?, ?)",
    [company_name, stock_price, market_cap, revenue, profit],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Data added successfully", id: result.insertId });
    }
  );
};

// ✅ Update Data
exports.updateData = (req, res) => {
  const id = req.params.id;
  const { company_name, stock_price, market_cap, revenue, profit } = req.body;
  db.query(
    "UPDATE financial_data SET company_name=?, stock_price=?, market_cap=?, revenue=?, profit=? WHERE id=?",
    [company_name, stock_price, market_cap, revenue, profit, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Data updated successfully" });
    }
  );
};

// ✅ Delete Data
exports.deleteData = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM financial_data WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Data deleted successfully" });
  });
};
