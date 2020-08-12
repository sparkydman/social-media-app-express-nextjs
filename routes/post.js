const express = require("express");
const { getUserById } = require("../controller/userController");
const { catchErrors } = require("../util/catchErrors");
const { requiredAuth } = require("../controller/authController");
const {
  resizeImage,
  upLoadImage,
  addPost,
  getPostsByUser,
  getPostFeed,
  toggleLike,
} = require("../controller/postController");

const router = express.Router();

/**
 * POST ROUTES
 * ROOT ROUTE: /api/posts
 * END POINTS: /new/:userId, /like, /unlike, /by/:userId, /feed/:userId
 */

router.param("userId", getUserById);

router.put("/like", requiredAuth, catchErrors(toggleLike));
router.put("/unlike", requiredAuth, catchErrors(toggleLike));

router.post(
  "/new/:userId",
  requiredAuth,
  upLoadImage,
  catchErrors(resizeImage),
  catchErrors(addPost)
);

router.get("/by/:userId", requiredAuth, catchErrors(getPostsByUser));
router.get("/feed/:userId", requiredAuth, catchErrors(getPostFeed));

module.exports = router;
