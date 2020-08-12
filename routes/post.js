const express = require("express");
const { getUserById } = require("../controller/userController");
const { catchErrors } = require("../util/catchErrors");
const { requiredAuth } = require("../controller/authController");
const {
  resizeImage,
  upLoadImage,
  addPost,
} = require("../controller/postController");

const router = express.Router();

/**
 * POST ROUTES
 * ROOT ROUTE: /api/posts
 * END POINTS: /new/:userId
 */

router.param("userId", getUserById);

router.post(
  "/new/:userId",
  requiredAuth,
  upLoadImage,
  catchErrors(resizeImage),
  catchErrors(addPost)
);

module.exports = router;
