const mongoose = require("mongoose");
const passport = require("passport");

//Crreate a user model singleton
const User = mongoose.model("User");

exports.validateSignUp = (req, res, next) => {
  //sanitize the req.body data with passport middleware
  req.sanitizeBody("name");
  req.sanitizeBody("email");
  req.sanitizeBody("password");
  req.sanitizeBody("about");

  //validate the req.body data
  req.checkBody("name", "Name is require").notEmpty();
  req
    .checkBody("name", "Name must be between 4 and 25 characters")
    .isLength({ min: 4, max: 25 });

  req.checkBody("email", "Enter valid email").isEmail().normalizeEmail();

  req.checkBody("password", "Password is require").notEmpty();
  req
    .checkBody("password", "Password must be between 4 and 25 characters")
    .isLength({ min: 4, max: 25 });

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((err) => err.msg)[0];
    return res.status(400).json(firstError);
  }
  next();
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, password, about } = req.body;
    const user = await new User({ name, email, password, about });
    await User.register(user, password, (err, user) => {
      if (err) {
        return res.status(500).json(err.message);
      }
      return res.json(user.name);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.signIn = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    if (!user) {
      return res.status(400).json(info.message);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json(err.message);
      }
      res.json(user);
    });
  })(req, res, next);
};

exports.signOut = (req, res) => {
  res.clearCookie("next-cookie.sid");
  req.logout();
  res.json({ message: "You are now logged out" });
};

exports.requiredAuth = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/auth/signin");
};
