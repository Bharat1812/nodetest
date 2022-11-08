const express = require("express")
const app = express()
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
app.use(express.json())
app.use(cookieParser());
const PORT = 5000

connectDB();
dotenv.config();
app.use("/api/users", require("./auth/route"))
app.use("/api", require("./auth/jokeRoute"))

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
)
// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})