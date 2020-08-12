const express = require("express");
const { catchErrors } = require("../util/catchErrors");
const { requiredAuth } = require("../controller/authController");
const {
  allUser,
  getUserById,
  deleteUser,
  getAuthUser,
  getUserProfile,
  addFollowing,
  addFollower,
  delFollower,
  delFollowing,
  getUserFeed,
  upLoadAvatar,
  resizeAvatar,
  updateUser,
} = require("../controller/userController");
const router = express.Router();

/**
 * USER ROUTES:
 * ROOT ROUTE: /api/user
 * ENDPOINTS: /, /user/:userid, /follow, /unfollow, /feed/:userId, /profile:userId
 */

router.param("userId", getUserById);

router.get("/", catchErrors(allUser));

router.put("/follow", catchErrors(addFollowing), catchErrors(addFollower));
router.put("/unfollow", catchErrors(delFollowing), catchErrors(delFollower));

router
  .route("/:userId")
  .get(getAuthUser)
  .put(
    requiredAuth,
    upLoadAvatar,
    catchErrors(resizeAvatar),
    catchErrors(updateUser)
  )
  .delete(requiredAuth, catchErrors(deleteUser));
router.get("/profile/:userId", getUserProfile);

router.get("/feed/:userId", requiredAuth, catchErrors(getUserFeed));

module.exports = router;
