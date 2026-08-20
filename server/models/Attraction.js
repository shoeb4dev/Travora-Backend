const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      enum: [
        "historical",
        "nature",
        "religious",
        "museum",
        "beach",
        "adventure",
        "food",
        "shopping",
        "entertainment",
        "other",
      ],
      default: "other",
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },

      address: {
        type: String,
        trim: true,
      },
    },

    openingHours: {
      type: String,
      default: "",
    },

    ticketPrice: {
      type: String,
      default: "Free",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    location: {
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  },

  coordinates: {
    type: [Number],
    required: true,
  },
},
    audioStory: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

attractionSchema.index({
  location: "2dsphere",
});

const Attraction = mongoose.model("Attraction", attractionSchema);

module.exports = Attraction;