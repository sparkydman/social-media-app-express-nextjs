const express = require("express");
const {
  validateSignUp,
  signUp,
  signIn,
  signOut,
} = require("../controller/authController");

const router = express.Router();

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/**
 * AUTH ROUTES
 * ROOT ROUTE: /api/auth
 * ENDPOINTS: /signup, /signin, /signout
 */
router.post("/signup", validateSignUp, catchErrors(signUp));
router.post("/signin", signIn);
router.get("/logout", signOut);

module.exports = router;
