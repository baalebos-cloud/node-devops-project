const express = require("express")
const { Pool } = require("pg")

const app = express()

const PORT = process.env.PORT || 3000

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "example",
  database: process.env.DB_NAME || "appdb",
  port: process.env.DB_PORT || 5432
})

app.use(express.json())

// Root endpoint
app.get("/", (req, res) => {
  console.log(`Request received at ${new Date().toISOString()}`)
  res.status(200).json({
    message: "Node DevOps App is running 🚀"
  })
})

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1")

    res.status(200).json({
      status: "OK",
      database: "connected",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Health check failed:", error.message)

    res.status(500).json({
      status: "FAILED",
      database: "disconnected"
    })
  }
})

// Example database route
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")

    res.status(200).json({
      message: "Database query successful",
      time: result.rows[0]
    })
  } catch (error) {
    console.error("Database error:", error.message)

    res.status(500).json({
      error: "Database query failed"
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
