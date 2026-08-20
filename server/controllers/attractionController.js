const Attraction = require("../models/Attraction");
const City = require("../models/City");
const Country = require("../models/Country");

// CREATE ATTRACTION
const createAttraction = async (req, res) => {
  try {
    const {
      name,
      city,
      country,
      description,
      images,
      category,
      location,
      openingHours,
      ticketPrice,
      rating,
      audioStory,
    } = req.body;

    // Required fields
    if (
      !name ||
      !city ||
      !country ||
      !description ||
      !location ||
      location.latitude === undefined ||
      location.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, city, country, description and location coordinates are required",
      });
    }

    // Check country exists
    const countryExists = await Country.findById(country);

    if (!countryExists) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    // Check city exists
    const cityExists = await City.findById(city);

    if (!cityExists) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // Make sure city belongs to country
    if (cityExists.country.toString() !== country.toString()) {
      return res.status(400).json({
        success: false,
        message: "Selected city does not belong to the selected country",
      });
    }

    // Check duplicate attraction in same city
    const existingAttraction = await Attraction.findOne({
      name,
      city,
    });

    if (existingAttraction) {
      return res.status(400).json({
        success: false,
        message: "Attraction already exists in this city",
      });
    }

    // Create attraction
    const attraction = await Attraction.create({
      name,
      city,
      country,
      description,
      images,
      category,
      location,
      openingHours,
      ticketPrice,
      rating,
      audioStory,
    });

    const populatedAttraction = await Attraction.findById(
      attraction._id
    )
      .populate("country", "name code")
      .populate("city", "name");

    res.status(201).json({
      success: true,
      message: "Attraction created successfully",
      attraction: populatedAttraction,
    });
  } catch (error) {
    console.error("Create Attraction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET ALL ATTRACTIONS
// const getAttractions = async (req, res) => {
//   try {
//     const attractions = await Attraction.find({
//       isActive: true,
//     })
//       .populate("country", "name code")
//       .populate("city", "name")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: attractions.length,
//       attractions,
//     });
//   } catch (error) {
//     console.error("Get Attractions Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


const getAttractions = async (req, res) => {
  try {
    const {
      search,
      city,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(parseInt(page) || 1, 1);

    const perPage = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      50
    );

    const skip = (currentPage - 1) * perPage;

    const filter = {};

    // Search by attraction name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by city
    if (city) {
      filter.city = city;
    }

    // Filter by category
    if (category) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }

    const [attractions, total] = await Promise.all([
      Attraction.find(filter)
        .populate("city", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),

      Attraction.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,

      page: currentPage,

      limit: perPage,

      total,

      totalPages: Math.ceil(total / perPage),

      hasNextPage:
        currentPage < Math.ceil(total / perPage),

      hasPreviousPage:
        currentPage > 1,

      attractions,
    });
  } catch (error) {
    console.error("Get Attractions Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ATTRACTIONS BY CITY
const getAttractionsByCity = async (req, res) => {
  try {
    const attractions = await Attraction.find({
      city: req.params.cityId,
      isActive: true,
    })
      .populate("country", "name code")
      .populate("city", "name")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: attractions.length,
      attractions,
    });
  } catch (error) {
    console.error("Get Attractions By City Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE ATTRACTION
const getAttractionById = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id)
      .populate("country", "name code")
      .populate("city", "name");

    if (!attraction) {
      return res.status(404).json({
        success: false,
        message: "Attraction not found",
      });
    }

    res.status(200).json({
      success: true,
      attraction,
    });
  } catch (error) {
    console.error("Get Attraction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE ATTRACTION
const updateAttraction = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);

    if (!attraction) {
      return res.status(404).json({
        success: false,
        message: "Attraction not found",
      });
    }

    const updatedAttraction = await Attraction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("country", "name code")
      .populate("city", "name");

    res.status(200).json({
      success: true,
      message: "Attraction updated successfully",
      attraction: updatedAttraction,
    });
  } catch (error) {
    console.error("Update Attraction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE ATTRACTION
const deleteAttraction = async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndDelete(
      req.params.id
    );

    if (!attraction) {
      return res.status(404).json({
        success: false,
        message: "Attraction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attraction deleted successfully",
    });
  } catch (error) {
    console.error("Delete Attraction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// SEARCH AND FILTER ATTRACTIONS
const searchAttractions = async (req, res) => {
  try {
    const {
      search,
      city,
      country,
      category,
      minRating,
      maxRating,
    } = req.query;

    const filter = {};

    // Text search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // City filter
    if (city) {
      filter.city = city;
    }

    // Country filter
    if (country) {
      filter.country = country;
    }

    // Category filter
    if (category) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }

    // Rating filter
    if (minRating || maxRating) {
      filter.rating = {};

      if (minRating) {
        filter.rating.$gte = Number(minRating);
      }

      if (maxRating) {
        filter.rating.$lte = Number(maxRating);
      }
    }

    const attractions = await Attraction.find(filter)
      .populate("city", "name")
      .populate("country", "name")
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: attractions.length,
      filters: {
        search: search || null,
        city: city || null,
        country: country || null,
        category: category || null,
        minRating: minRating || null,
        maxRating: maxRating || null,
      },
      attractions,
    });
  } catch (error) {
    console.error("Search Attractions Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getNearbyAttractions = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Longitude and latitude are required",
      });
    }

    const lng = Number(longitude);
    const lat = Number(latitude);
    const distance = Number(maxDistance);

    if (
      Number.isNaN(lng) ||
      Number.isNaN(lat) ||
      Number.isNaN(distance)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude, latitude or distance",
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90",
      });
    }

    if (lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180",
      });
    }

    const attractions = await Attraction.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: distance,
        },
      },
    })
      .populate("city", "name")
      .populate("country", "name");

    res.status(200).json({
      success: true,
      count: attractions.length,
      maxDistance: distance,
      attractions,
    });
  } catch (error) {
    console.error("Nearby Attractions Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createAttraction,
  getAttractions,
  getAttractionsByCity,
  getAttractionById,
  updateAttraction,
  deleteAttraction,
  searchAttractions,
  getNearbyAttractions,
};