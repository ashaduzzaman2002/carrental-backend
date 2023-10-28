import cors from "cors";
import express from "express";
import morgon from "morgon";
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const connectDB = require("./config/db");


/**middlewares */
app.use(cors());
app.use(morgon("dev"));

/** Disable the X-Powered-By header*/
app.disable("x-powered-by");

/** Http get request */
app.get("/", (req, res) => {
  res.send("working fine ");
});


// DB connect
connectDB();

/** start Server  */
app.listen(port, () =>
  console.log(`Server is started sucessfully http://localhost:${port}`)
);