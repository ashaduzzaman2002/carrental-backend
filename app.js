//

import cors from "cors";
import express from "express";
import morgon from "morgon";

const app = express();

/**middlewares */
app.use(cors());
app.use(morgon("dev"));

/** Disable the X-Powered-By header*/
app.disable("x-powered-by");

/** Http get request */
app.get("/", (req, res) => {
  res.send("working fine ");
});

/** start Server  */
app.listen(5000, () => {
  "Server is started sucessfully";
});
