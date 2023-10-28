const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("working fine ");
});

// DB connect
connectDB();

app.listen(port, () =>
  console.log(`Server is started sucessfully http://localhost:${port}`)
);
