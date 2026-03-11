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

// Middleware to parse JSON
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  console.log(`Request received at ${new Date().toISOString()}`);
  res.status(200).json({
    message: "Node DevOps App is running 🚀"
  });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "OK",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check failed:", error.message);
    res.status(500).json({
      status: "FAILED",
      database: "disconnected",
      error: error.message
    });
  }
});

// GET /status endpoint
app.get("/status", (req, res) => {
  res.json({
    app: "Node-DevOps Project",
    environment: process.env.NODE_ENV || "demo",
    uptime_seconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// POST /process endpoint
app.post("/process", (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Missing 'task' in request body" });
  }

  // Simulate processing
  res.json({
    message: `Task '${task}' processed successfully`,
    processed_at: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Node-DevOps app listening at http://localhost:${PORT}`);
});
