const City = require("../models/City");
const Country = require("../models/Country");

// CREATE CITY
const createCity = async (req, res) => {
  try {
    const { name, country, description, image } = req.body;

    if (!name || !country) {
      return res.status(400).json({
        success: false,
        message: "City name and country are required",
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

    // Check duplicate city in same country
    const existingCity = await City.findOne({
      name,
      country,
    });

    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: "City already exists in this country",
      });
    }

    const city = await City.create({
      name,
      country,
      description,
      image,
    });

    const populatedCity = await City.findById(city._id).populate(
      "country",
      "name code"
    );

    res.status(201).json({
      success: true,
      message: "City created successfully",
      city: populatedCity,
    });
  } catch (error) {
    console.error("Create City Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET ALL CITIES
const getCities = async (req, res) => {
  try {
    const cities = await City.find({ isActive: true })
      .populate("country", "name code")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    console.error("Get Cities Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET CITIES BY COUNTRY
const getCitiesByCountry = async (req, res) => {
  try {
    const cities = await City.find({
      country: req.params.countryId,
      isActive: true,
    })
      .populate("country", "name code")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    console.error("Get Cities By Country Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE CITY
const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).populate(
      "country",
      "name code"
    );

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.status(200).json({
      success: true,
      city,
    });
  } catch (error) {
    console.error("Get City Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE CITY
const updateCity = async (req, res) => {
  try {
    const { name, country, description, image, isActive } = req.body;

    if (country) {
      const countryExists = await Country.findById(country);

      if (!countryExists) {
        return res.status(404).json({
          success: false,
          message: "Country not found",
        });
      }
    }

    const city = await City.findByIdAndUpdate(
      req.params.id,
      {
        name,
        country,
        description,
        image,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("country", "name code");

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "City updated successfully",
      city,
    });
  } catch (error) {
    console.error("Update City Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE CITY
const deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    console.error("Delete City Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createCity,
  getCities,
  getCitiesByCountry,
  getCityById,
  updateCity,
  deleteCity,
};