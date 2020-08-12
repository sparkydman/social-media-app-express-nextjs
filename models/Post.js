const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: "Post text is required",
    },
    image: {
      type: String,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
    postedBy: { type: ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
  {
    autoIndex: false,
  }
);

/* Create a function to populate postedBy automatically on every findOne and find query */
const autoPupolatePostedBy = function (next) {
  this.populate("postedBy", "_id name avatar");
  this.populate("comments.postedBy", "_id name avatar");
  next();
};

/*Fetch the postedBy field using the pre hook */
postSchema
  .pre("findOne", autoPupolatePostedBy)
  .pre("find", autoPupolatePostedBy);

// Create index on keys for more performance on queryng/post sorting
postSchema.index({ postedBy: 1, createdAt: 1 });

module.exports = mongoose.model("Post", postSchema);
