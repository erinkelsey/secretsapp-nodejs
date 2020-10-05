/**
 * Setup and initialization.
 */
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/**
 * MongoDB and mongoose setup, including schema and models
 * for User.
 */
mongoose.connect(process.env.MONGODB_SRV_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
 * If no match, returns to login page, else renders the secrets page.
 */
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) res.redirect("/login");
    else res.redirect("/secrets");
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
 * Redirects to register page if there is an error.
 */
app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) res.redirect("/register");
      else
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
    }
  );
});

/**
 * GET method for the /secrets route.
 *
 * Main page for app. User must be authenticated to view.
 * Redirects to login page if user is not authenticated.
 */
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) res.render("secrets");
  else res.redirect("login");
});

/**
 * GET method for /logout route.
 *
 * Logs user out (removes authentication - cookie and session),
 * and redirects to home page.
 */
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

/**
 * Start up server to listen on port 3000.
 */
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
