const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const mongooseErrorHandler = require("mongoose-mongodb-errors");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: "Email is required",
    },
    name: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: "Name is required",
    },
    avatar: {
      type: String,
      default: "/public/img/profile-image.jpg",
      required: "Avatar image is required",
    },
    about: {
      type: String,
      trim: true,
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

/* Functiion to automatiically  fetch the followers and following user on every findOne query */
const autoPopulateUser = function (next) {
  this.populate("following", "_id name avatar");
  this.populate("followers", "_id name avatar");
  next();
};

// Add the middleware for autopulateUser on pre hook
userSchema.pre("findOne", autoPopulateUser);

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

/* Add mongoose error handler plugin for nice error messages */
userSchema.plugin(mongooseErrorHandler);

module.exports = mongoose.model("User", userSchema);
