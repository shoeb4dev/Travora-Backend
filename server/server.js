require("dotenv").config();
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const countryRoutes = require("./routes/countryRoutes");
const cityRoutes = require("./routes/cityRoutes");
const attractionRoutes = require("./routes/attractionRoutes");
const reelRoutes = require("./routes/reelRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const audioStoryRoutes = require("./routes/audioStoryRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
app.use("/api/auth", authRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/attractions", attractionRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/audio-stories", audioStoryRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/upload", uploadRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Travora API is running 🚀",
  });
});

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});