const AudioStory = require("../models/AudioStory");
const Attraction = require("../models/Attraction");

// CREATE AUDIO STORY
const createAudioStory = async (req, res) => {
  try {
    const {
      title,
      description,
      audioUrl,
      thumbnail,
      duration,
      language,
      attraction,
    } = req.body;

    if (!title || !audioUrl || !language || !attraction) {
      return res.status(400).json({
        success: false,
        message:
          "Title, audio URL, language and attraction are required",
      });
    }

    // Check attraction
    const attractionExists = await Attraction.findById(attraction);

    if (!attractionExists) {
      return res.status(404).json({
        success: false,
        message: "Attraction not found",
      });
    }

    const audioStory = await AudioStory.create({
      title,
      description,
      audioUrl,
      thumbnail,
      duration,
      language,
      attraction,
      createdBy: req.user.userId,
    });

    const populatedAudioStory = await AudioStory.findById(
      audioStory._id
    )
      .populate("attraction", "name")
      .populate("createdBy", "name");

    res.status(201).json({
      success: true,
      message: "Audio story created successfully",
      audioStory: populatedAudioStory,
    });
  } catch (error) {
    console.error("Create Audio Story Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET ALL AUDIO STORIES
const getAudioStories = async (req, res) => {
  try {
    const audioStories = await AudioStory.find({
      isActive: true,
    })
      .populate("attraction", "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: audioStories.length,
      audioStories,
    });
  } catch (error) {
    console.error("Get Audio Stories Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET AUDIO STORIES BY ATTRACTION
const getAudioStoriesByAttraction = async (req, res) => {
  try {
    const audioStories = await AudioStory.find({
      attraction: req.params.attractionId,
      isActive: true,
    })
      .populate("attraction", "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: audioStories.length,
      audioStories,
    });
  } catch (error) {
    console.error("Get Audio Stories By Attraction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE AUDIO STORY
const getAudioStoryById = async (req, res) => {
  try {
    const audioStory = await AudioStory.findById(req.params.id)
      .populate("attraction", "name")
      .populate("createdBy", "name");

    if (!audioStory) {
      return res.status(404).json({
        success: false,
        message: "Audio story not found",
      });
    }

    res.status(200).json({
      success: true,
      audioStory,
    });
  } catch (error) {
    console.error("Get Audio Story Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE AUDIO STORY
const updateAudioStory = async (req, res) => {
  try {
    const audioStory = await AudioStory.findById(req.params.id);

    if (!audioStory) {
      return res.status(404).json({
        success: false,
        message: "Audio story not found",
      });
    }

    // Only creator can update
    if (audioStory.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this audio story",
      });
    }

    const updatedAudioStory =
      await AudioStory.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("attraction", "name")
        .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      message: "Audio story updated successfully",
      audioStory: updatedAudioStory,
    });
  } catch (error) {
    console.error("Update Audio Story Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE AUDIO STORY
const deleteAudioStory = async (req, res) => {
  try {
    const audioStory = await AudioStory.findById(req.params.id);

    if (!audioStory) {
      return res.status(404).json({
        success: false,
        message: "Audio story not found",
      });
    }

    // Only creator can delete
    if (audioStory.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this audio story",
      });
    }

    await AudioStory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Audio story deleted successfully",
    });
  } catch (error) {
    console.error("Delete Audio Story Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createAudioStory,
  getAudioStories,
  getAudioStoriesByAttraction,
  getAudioStoryById,
  updateAudioStory,
  deleteAudioStory,
};