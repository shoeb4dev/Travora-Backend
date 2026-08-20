const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Travora API",
      version: "1.0.0",
      description:
        "API documentation for the Travora travel application",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Shoeb Khan",
            },
            email: {
              type: "string",
              format: "email",
              example: "shoeb@example.com",
            },
            password: {
              type: "string",
              example: "Password123",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              example: "user",
            },
          },
        },

        Country: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "India",
            },
            description: {
              type: "string",
              example: "A diverse country with rich history and culture.",
            },
            image: {
              type: "string",
              example: "https://example.com/india.jpg",
            },
          },
        },

        City: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Hyderabad",
            },
            description: {
              type: "string",
              example: "The City of Pearls.",
            },
            country: {
              type: "string",
              example: "COUNTRY_OBJECT_ID",
            },
            image: {
              type: "string",
              example: "https://example.com/hyderabad.jpg",
            },
          },
        },

        Attraction: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Charminar",
            },
            description: {
              type: "string",
              example: "Historic monument located in Hyderabad.",
            },
            city: {
              type: "string",
              example: "CITY_OBJECT_ID",
            },
            category: {
              type: "string",
              example: "Historical",
            },
            image: {
              type: "string",
              example: "https://example.com/charminar.jpg",
            },
          },
        },

        Reel: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "Exploring Charminar",
            },
            description: {
              type: "string",
              example: "A short travel reel about Charminar.",
            },
            videoUrl: {
              type: "string",
              example: "https://res.cloudinary.com/example/video/upload/reel.mp4",
            },
            attraction: {
              type: "string",
              example: "ATTRACTION_OBJECT_ID",
            },
          },
        },

        AudioStory: {
          type: "object",
          required: [
            "title",
            "audioUrl",
            "language",
            "attraction",
          ],
          properties: {
            title: {
              type: "string",
              example: "The Story of Charminar",
            },
            description: {
              type: "string",
              example: "Discover the history of Charminar.",
            },
            audioUrl: {
              type: "string",
              example: "https://res.cloudinary.com/example/audio/story.mp3",
            },
            language: {
              type: "string",
              example: "English",
            },
            attraction: {
              type: "string",
              example: "ATTRACTION_OBJECT_ID",
            },
          },
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;