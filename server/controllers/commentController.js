const Comment = require("../models/Comment");
const Reel = require("../models/Reel");

// CREATE COMMENT
const createComment = async (req, res) => {
  try {
    const { reelId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    const comment = await Comment.create({
      user: userId,
      reel: reelId,
      text: text.trim(),
    });

    // Increase comment count
    reel.commentsCount += 1;
    await reel.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
      commentsCount: reel.commentsCount,
    });
  } catch (error) {
    console.error("Create Comment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET COMMENTS FOR REEL
const getReelComments = async (req, res) => {
  try {
    const { reelId } = req.params;

    const comments = await Comment.find({
      reel: reelId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Get Comments Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE COMMENT
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Only comment owner can update
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own comment",
      });
    }

    comment.text = text.trim();

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("user", "name");

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Update Comment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Only comment owner can delete
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comment",
      });
    }

    const reel = await Reel.findById(comment.reel);

    await Comment.findByIdAndDelete(commentId);

    // Decrease count
    if (reel && reel.commentsCount > 0) {
      reel.commentsCount -= 1;
      await reel.save();
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      commentsCount: reel ? reel.commentsCount : 0,
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createComment,
  getReelComments,
  updateComment,
  deleteComment,
};