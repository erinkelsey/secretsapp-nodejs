/**
 * Setup and initialization.
 */
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

/**
 * MongoDB and mongoose setup, including schema and models
 * for User, and encryption setup.
 */
mongoose.connect(process.env.MONGODB_SRV_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// for mongoose-encryption
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET_KEY,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("User", userSchema);

/**
 * GET method for / route.
 *
 * Renders the home page.
 */
app.get("/", (req, res) => {
  res.render("home");
});

/**
 * GET method for /login route.
 *
 * Renders the login page.
 */
app.get("/login", (req, res) => {
  res.render("login");
});

/**
 * POST method for /login route.
 *
 * Checks if the submitted username/email and password matches a user in the db.
 * If no match, returns to homepage, else renders the secrets page.
 */
app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, user) => {
    if (err) console.log(err);
    else if (user && user.password === md5(req.body.password))
      res.render("secrets");
    else res.redirect("/");
  });
});

/**
 * GET method for /register route.
 *
 * Renders the register page.
 */
app.get("/register", (req, res) => {
  res.render("register");
});

/**
 * POST method for /register route.
 *
 * Registers a user with the submitted username/email and password.
 * Renders the secrets page once registration has finished.
 */
app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save((err) => {
    if (err) console.log(err);
    else res.render("secrets");
  });
});

/**
 * Start up server to listen on port 3000.
 */
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
