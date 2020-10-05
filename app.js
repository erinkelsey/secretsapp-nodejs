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
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const findOrCreate = require("mongoose-findorcreate");

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
 *
 * Setup Passport.js for hashing, salting passwords
 * and implementing cookies and sessions.
 *
 * Setup Google OAuth2.0 for allowing users to register
 * and login with a Google Account.
 *
 * Setup Local Strategy, so that users can login with an
 * account setup with the app.
 */
mongoose.connect(process.env.MONGODB_SRV_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOrCreate({ googleId: profile.id }, (err, user) => {
        return cb(err, user);
      });
    }
  )
);

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: "User could not be authenticated.",
        });
      }
      return done(null, user);
    });
  })
);

/**
 * GET method for / route.
 *
 * Renders the home page.
 */
app.get("/", (req, res) => {
  res.render("home");
});

/**
 * GET method for /auth/google route.
 *
 * Uses Passport.js to authenticate through Google.
 * Redirects to a Google page for authentication.
 */
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

/**
 * GET method for /auth/google/secrets route, which is the
 * callback function when user has been authenticated with Google.
 *
 * If authentication failed, redirect to login page, else
 * redirect to secrets page.
 */
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/secrets");
  }
);

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
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

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
