const Playlist = require("../models/Playlist");
const Attraction = require("../models/Attraction");


// CREATE PLAYLIST
const createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Playlist name is required",
      });
    }

    const playlist = await Playlist.create({
      name: name.trim(),
      description,
      isPublic,
      user: req.user.userId,
    });

    const populatedPlaylist = await Playlist.findById(playlist._id)
      .populate("user", "name")
      .populate("attractions", "name images category");

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playlist: populatedPlaylist,
    });
  } catch (error) {
    console.error("Create Playlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET MY PLAYLISTS
const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({
      user: req.user.userId,
    })
      .populate("attractions", "name images category city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: playlists.length,
      playlists,
    });
  } catch (error) {
    console.error("Get My Playlists Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET PUBLIC PLAYLIST
const getPublicPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      isPublic: true,
    })
      .populate("user", "name")
      .populate("attractions", "name images category city");

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Public playlist not found",
      });
    }

    res.status(200).json({
      success: true,
      playlist,
    });
  } catch (error) {
    console.error("Get Public Playlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ADD ATTRACTION TO PLAYLIST
const addAttractionToPlaylist = async (req, res) => {
  try {
    const { playlistId, attractionId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    // Only owner can modify playlist
    if (playlist.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this playlist",
      });
    }

    // Check attraction
    const attraction = await Attraction.findById(attractionId);

    if (!attraction) {
      return res.status(404).json({
        success: false,
        message: "Attraction not found",
      });
    }

    // Prevent duplicate attraction
    if (playlist.attractions.includes(attractionId)) {
      return res.status(400).json({
        success: false,
        message: "Attraction already exists in this playlist",
      });
    }

    playlist.attractions.push(attractionId);

    await playlist.save();

    const updatedPlaylist = await Playlist.findById(playlist._id)
      .populate("user", "name")
      .populate("attractions", "name images category");

    res.status(200).json({
      success: true,
      message: "Attraction added to playlist",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error("Add Attraction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// REMOVE ATTRACTION FROM PLAYLIST
const removeAttractionFromPlaylist = async (req, res) => {
  try {
    const { playlistId, attractionId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    if (playlist.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this playlist",
      });
    }

    playlist.attractions = playlist.attractions.filter(
      (id) => id.toString() !== attractionId
    );

    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Attraction removed from playlist",
      playlist,
    });
  } catch (error) {
    console.error("Remove Attraction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE PLAYLIST
const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    if (playlist.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this playlist",
      });
    }

    const { name, description, isPublic } = req.body;

    if (name !== undefined) {
      playlist.name = name.trim();
    }

    if (description !== undefined) {
      playlist.description = description;
    }

    if (isPublic !== undefined) {
      playlist.isPublic = isPublic;
    }

    await playlist.save();

    const updatedPlaylist = await Playlist.findById(playlist._id)
      .populate("user", "name")
      .populate("attractions", "name images category");

    res.status(200).json({
      success: true,
      message: "Playlist updated successfully",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error("Update Playlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE PLAYLIST
const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    if (playlist.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this playlist",
      });
    }

    await Playlist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Delete Playlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createPlaylist,
  getMyPlaylists,
  getPublicPlaylist,
  addAttractionToPlaylist,
  removeAttractionFromPlaylist,
  updatePlaylist,
  deletePlaylist,
};