const Reel = require("../models/Reel");
const Attraction = require("../models/Attraction");

// CREATE REEL
const createReel = async (req, res) => {
  try {
    const {
      title,
      caption,
      videoUrl,
      thumbnail,
      attraction,
    } = req.body;

    if (!title || !videoUrl || !attraction) {
      return res.status(400).json({
        success: false,
        message: "Title, video URL and attraction are required",
      });
    }

    // Check attraction exists
    const attractionExists = await Attraction.findById(attraction);

    if (!attractionExists) {
      return res.status(404).json({
        success: false,
        message: "Attraction not found",
      });
    }

    const reel = await Reel.create({
      title,
      caption,
      videoUrl,
      thumbnail,
      attraction,
      user: req.user.userId,
    });

    const populatedReel = await Reel.findById(reel._id)
      .populate("user", "name")
      .populate("attraction", "name");

    res.status(201).json({
      success: true,
      message: "Reel created successfully",
      reel: populatedReel,
    });
  } catch (error) {
    console.error("Create Reel Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET ALL REELS
// const getReels = async (req, res) => {
//   try {
//     const reels = await Reel.find({
//       isActive: true,
//     })
//       .populate("user", "name")
//       .populate("attraction", "name")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: reels.length,
//       reels,
//     });
//   } catch (error) {
//     console.error("Get Reels Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


const getReels = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    const [reels, total] = await Promise.all([
      Reel.find()
        .populate("attraction", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Reel.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
      reels,
    });
  } catch (error) {
    console.error("Get Reels Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET REELS BY ATTRACTION
const getReelsByAttraction = async (req, res) => {
  try {
    const reels = await Reel.find({
      attraction: req.params.attractionId,
      isActive: true,
    })
      .populate("user", "name")
      .populate("attraction", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reels.length,
      reels,
    });
  } catch (error) {
    console.error("Get Reels By Attraction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE REEL
const getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate("user", "name")
      .populate("attraction", "name");

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    res.status(200).json({
      success: true,
      reel,
    });
  } catch (error) {
    console.error("Get Reel Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE REEL
const updateReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    // Only owner can update
    if (reel.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this reel",
      });
    }

    const {
      title,
      caption,
      videoUrl,
      thumbnail,
      attraction,
      isActive,
    } = req.body;

    const updatedReel = await Reel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        caption,
        videoUrl,
        thumbnail,
        attraction,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name")
      .populate("attraction", "name");

    res.status(200).json({
      success: true,
      message: "Reel updated successfully",
      reel: updatedReel,
    });
  } catch (error) {
    console.error("Update Reel Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE REEL
const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    // Only owner can delete
    if (reel.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this reel",
      });
    }

    await Reel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Reel deleted successfully",
    });
  } catch (error) {
    console.error("Delete Reel Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createReel,
  getReels,
  getReelsByAttraction,
  getReelById,
  updateReel,
  deleteReel,
};