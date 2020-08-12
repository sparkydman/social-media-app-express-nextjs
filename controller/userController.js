const mongoose = require("mongoose");

const User = mongoose.model("User");

exports.allUser = async (req, res) => {
  const users = await User.find().select(
    "_id name email about createdAt updatedAt"
  );
  return res.status(200).json(users);
};

exports.getUserById = async (req, res, next, id) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }
  req.profile = user;
  const profileId = mongoose.Types.ObjectId(req.profile._id);

  if (req.user && profileId.equals(req.user._id)) {
    req.isAuthUser = true;
    return next();
  }
  next();
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!req.isAuthUser) {
    return res
      .status(401)
      .json({ message: "You are not authorized to perform this action" });
  }
  const delUser = await User.findOneAndDelete({ _id: userId });
  res.status(200).json(delUser);
};

exports.getAuthUser = async (req, res) => {
  if (!req.isAuthUser) {
    res
      .status(401)
      .json({ message: "You are not authenticated user signup or signin" });
    return res.redirect("/api/auth/signin");
  }
  res.json(req.user);
};

exports.getUserProfile = async (req, res) => {
  if (!req.profile) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(req.profile);
};

exports.addFollowing = async (req, res, next) => {
  const { followId } = req.body;
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: { following: followId },
    }
  );
  next();
};

exports.addFollower = async (req, res) => {
  const { followId } = req.body;

  const user = await User.findByIdAndUpdate(
    { _id: followId },
    { $push: { following: req.user._id } },
    { new: true }
  );
  res.status(200).json(user);
};
exports.delFollowing = async (req, res, next) => {
  const { followId } = req.body;
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { following: followId },
    }
  );
  next();
};

exports.delFollower = async (req, res) => {
  const { followId } = req.body;

  const user = await User.findByIdAndUpdate(
    { _id: followId },
    { $pull: { following: req.user._id } },
    { new: true }
  );
  res.status(200).json(user);
};

exports.getUserFeed = async (req, res) => {
  const { following, _id } = req.profile;

  following.push(_id);
  const users = await User.find({ _id: { $nin: following } }).select(
    "_id name avatar"
  );
  res.json(users);
};
