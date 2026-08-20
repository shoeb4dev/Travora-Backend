const Like = require("../models/Like");
const Reel = require("../models/Reel");

// LIKE OR UNLIKE A REEL
const toggleLike = async (req, res) => {
  try {
    const { reelId } = req.params;
    const userId = req.user.userId;

    // Check if reel exists
    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    // Check if user already liked the reel
    const existingLike = await Like.findOne({
      user: userId,
      reel: reelId,
    });

    // If already liked → UNLIKE
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      // Prevent negative count
      if (reel.likesCount > 0) {
        reel.likesCount -= 1;
        await reel.save();
      }

      return res.status(200).json({
        success: true,
        liked: false,
        message: "Reel unliked",
        likesCount: reel.likesCount,
      });
    }

    // CREATE LIKE
    await Like.create({
      user: userId,
      reel: reelId,
    });

    // Increase likes count
    reel.likesCount += 1;
    await reel.save();

    return res.status(201).json({
      success: true,
      liked: true,
      message: "Reel liked",
      likesCount: reel.likesCount,
    });
  } catch (error) {
    console.error("Toggle Like Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET LIKES OF A REEL
const getReelLikes = async (req, res) => {
  try {
    const { reelId } = req.params;

    const likes = await Like.find({
      reel: reelId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: likes.length,
      likes,
    });
  } catch (error) {
    console.error("Get Likes Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  toggleLike,
  getReelLikes,
};