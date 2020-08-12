const mongoose = require("mongoose");
const multer = require("multer");
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

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
  fs.unlink(path.join(__dirname, "..", delUser.avatar), (err) => {
    if (err) {
      console.log(err);
    }
  });
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

const avatarOptions = {
  storage: multer.memoryStorage(),
  limits: {
    // file size should be 1mb
    fileSize: 1024 * 1024 * 1,
  },
  fileFilter: (req, file, next) => {
    if (file.mimetype.startsWith("image/")) {
      next(null, true);
    } else {
      next(null, false);
    }
  },
};

exports.upLoadAvatar = multer(avatarOptions).single("avatar");

exports.resizeAvatar = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.avatar = `/public/uploads/avatars/${req.user.name.replace(
    /\s/g,
    "-"
  )}-${Date.now()}.${extension}`;
  const image = await jimp.read(req.file.buffer);
  await image.resize(250, jimp.AUTO);
  await image.write(`./${req.body.avatar}`);
  next();
};

exports.updateUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).select(
    "name email avatar about"
  );
  const argBody = {
    name: req.body.name || user.name,
    email: req.body.email || user.email,
    avatar: req.body.avatar || user.avatar,
    about: req.body.about || user.about,
  };

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: argBody },
    { new: true, runValidators: true }
  );

  fs.unlink(path.join(__dirname, "..", user.avatar), (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.json(updatedUser);
};
