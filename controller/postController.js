const mongoose = require("mongoose");
const multer = require("multer");
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const Post = mongoose.model("Post");

const imgOptions = {
  storage: multer.memoryStorage(),
  limits: {
    // file size should be 1mb
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: (req, file, next) => {
    if (file.mimetype.startsWith("image/")) {
      next(null, true);
    } else {
      next(null, false);
    }
  },
};

exports.upLoadImage = multer(imgOptions).single("image");

exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.image = `/${req.user.name.replace(
    /\s/g,
    "-"
  )}-${Date.now()}.${extension}`;
  const image = await jimp.read(req.file.buffer);
  await image.resize(750, jimp.AUTO);
  await image.write(`./public/${req.body.image}`);
  next();
};

exports.addPost = async (req, res) => {
  req.body.postedBy = req.user._id;
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: "postedBy",
    select: "_id name avatar",
  });
  res.json(post);
};

exports.getPostsByUser = async (req, res) => {
  const posts = await Post.find({ postedBy: req.profile._id }).sort({
    updatedAt: "desc",
  });
  res.json(posts);
};

exports.getPostFeed = async (req, res) => {
  const { following, followers, _id } = req.profile;
  following.push(_id);
  const posts = await Post.find({
    $or: [
      {
        postedBy: { $in: following },
      },
      {
        postedBy: { $in: followers },
      },
    ],
  }).sort({ updatedAt: "desc" });
  res.json(posts);
};

exports.toggleLike = async (req, res) => {
  const { postId } = req.body;

  const post = await Post.findOne({ _id: postId });
  const likedIds = post.likes.map((id) => id.toString());
  const authUserId = req.user._id.toString();
  if (likedIds.includes(authUserId)) {
    await post.likes.pull(authUserId);
  } else {
    await post.likes.push(authUserId);
  }
  await post.save();
  res.json(post);
};

exports.toggleComment = async (req, res) => {
  const { comment, postId } = req.body;

  let operator;
  let data;

  if (req.url.includes("uncomment")) {
    operator = "$pull";
    data = { _id: comment._id };
  } else {
    operator = "$push";
    data = { text: comment.text, postedBy: req.user._id };
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    { [operator]: { comments: data } },
    { new: true }
  )
    .populate("postedBy", "_id name avatar")
    .populate("comments.postedBy", "_id name avatar");
  res.json(updatedPost);
};

exports.findPostById = async (req, res, next, id) => {
  const post = await Post.findOne({ _id: id });
  req.post = post;

  const posterId = mongoose.Types.ObjectId(req.post.postedBy._id);
  if (req.user && posterId.equals(req.user._id)) {
    req.isPoster = true;
    return next();
  }
  next();
};

exports.deletePost = async (req, res) => {
  const { _id } = req.post;

  if (!req.isPoster) {
    return res.status(400).json({
      message: "You are not authorized to perform this action",
    });
  }
  const deletedPost = await Post.findOneAndDelete({ _id });
  fs.unlink(path.join(__dirname, "..", "public", deletedPost.image), (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.json(deletedPost);
};

exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { text, image } = req.body;
  const post = await Post.findOne({ _id: postId });

  const argBody = {
    text: text || post.text,
    image: image || post.image,
  };

  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    { $set: argBody },
    { new: true }
  );
  if (image) {
    fs.unlink(path.join(__dirname, "..", "public", post.image), (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  res.json(updatedPost);
};
