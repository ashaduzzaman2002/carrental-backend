var express = require("express");

var app = express();

app.get("/", (req, res) => {
  res.send("working fine ");
});
app.listen(5000, () => {
  "Server is started sucessfully";
});
