const express = require("express");
const {
  validateSignUp,
  signUp,
  signIn,
  signOut,
} = require("../controller/authController");

const { catchErrors } = require("../util/catchErrors");

const router = express.Router();

/**
 * AUTH ROUTES
 * ROOT ROUTE: /api/auth
 * ENDPOINTS: /signup, /signin, /signout
 */
router.post("/signup", validateSignUp, catchErrors(signUp));
router.post("/signin", signIn);
router.get("/logout", signOut);

module.exports = router;
