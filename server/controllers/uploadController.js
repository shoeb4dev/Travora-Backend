const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileBuffer = req.file.buffer;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "travora",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(fileBuffer);
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadToCloudinary,
};