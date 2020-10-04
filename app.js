/**
 * Setup and initialization.
 */
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO

/**
 * Start up server to listen on port 3000.
 */
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
