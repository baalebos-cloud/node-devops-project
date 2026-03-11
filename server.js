const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "example",
  database: process.env.DB_NAME || "appdb",
  port: process.env.DB_PORT || 5432
});

app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Node DevOps App is running 🚀" });
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "OK",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: "FAILED", database: "disconnected" });
  }
});

// Status endpoint
app.get("/status", (req, res) => {
  res.status(200).json({
    app: "Node-DevOps Project",
    environment: "demo",
    uptime_seconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Process task - now works with POST and GET
app.post("/process", (req, res) => {
  const task = req.body.task || "demo";
  res.status(200).json({
    message: `Task '${task}' processed successfully`,
    processed_at: new Date().toISOString()
  });
});

app.get("/process", (req, res) => {
  // fallback GET for demo in browser
  res.status(200).json({
    message: "Task 'demo' processed successfully (GET fallback)",
    processed_at: new Date().toISOString()
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
