const Country = require("../models/Country");

// CREATE COUNTRY
const createCountry = async (req, res) => {
  try {
    const { name, code, description, image } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Country name and code are required",
      });
    }

    const existingCountry = await Country.findOne({
      $or: [{ name }, { code }],
    });

    if (existingCountry) {
      return res.status(400).json({
        success: false,
        message: "Country already exists",
      });
    }

    const country = await Country.create({
      name,
      code,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Country created successfully",
      country,
    });
  } catch (error) {
    console.error("Create Country Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET ALL COUNTRIES
const getCountries = async (req, res) => {
  try {
    const countries = await Country.find({ isActive: true }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: countries.length,
      countries,
    });
  } catch (error) {
    console.error("Get Countries Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE COUNTRY
const getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);

    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    res.status(200).json({
      success: true,
      country,
    });
  } catch (error) {
    console.error("Get Country Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE COUNTRY
const updateCountry = async (req, res) => {
  try {
    const { name, code, description, image, isActive } = req.body;

    const country = await Country.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code,
        description,
        image,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Country updated successfully",
      country,
    });
  } catch (error) {
    console.error("Update Country Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE COUNTRY
const deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);

    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Country deleted successfully",
    });
  } catch (error) {
    console.error("Delete Country Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createCountry,
  getCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
};