import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// Import db
import connectDB from "./config/db.js";

/**middlewares */
app.use(cors());
app.use(morgan("dev"));

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
