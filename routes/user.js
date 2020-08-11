const express = require("express");
const { catchErrors } = require("../util/catchErrors");
const {
  allUser,
  getUserById,
  deleteUser,
  getAuthUser,
  getUserProfile,
} = require("../controller/userController");
const router = express.Router();

/**
 * USER ROUTES:
 * ROOT ROUTE: /api/user
 * ENDPOINTS: /users, /user/:userid
 */

router.param("userId", getUserById);

router.get("/", catchErrors(allUser));

router.route("/:userId").get(getAuthUser).delete(catchErrors(deleteUser));
router.get("/profile/:userId", getUserProfile);

module.exports = router;