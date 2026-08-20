const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user can like a reel only once
likeSchema.index(
  { user: 1, reel: 1 },
  { unique: true }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;