// // utils/uploadToCloudinary.js
// import { cloudinary } from "../config/cloudinary.js"; // uses named export above
// import fs from "fs";

// export const uploadToCloudinary = (file, folder = "app") => {
//   if (!file) return Promise.resolve(null);

//   const mime = (file.mimetype || "").toLowerCase();
//   const name = (file.originalname || "").toLowerCase();
//   const isImage = mime.startsWith("image/");
//   const isPDF = mime === "application/pdf" || name.endsWith(".pdf");
//   const resourceType = isImage ? "image" : "raw";

//   const options = {
//     folder,
//     resource_type: resourceType,
//     type: "upload",
//     use_filename: false,
//     unique_filename: true,
//     overwrite: false
//   };

//   // For PDFs, ensure browser inline preview possible
//   if (isPDF) {
//     options.format = "pdf";
//     options.flags = "attachment:false"; // request inline view
//   }

//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
//       if (error) return reject(error);
//       resolve(result); // return whole result (secure_url, bytes, etc.)
//     });

//     const readStream = fs.createReadStream(file.path);
//     readStream.on("error", (err) => reject(err));
//     readStream.pipe(uploadStream);
//   });
// };
import cloudinary from "../config/cloudinary.js"; // DEFAULT export
import fs from "fs";

export const uploadToCloudinary = async (file, folder = "app") => {
  if (!file) return null;

  const mime = (file.mimetype || "").toLowerCase();
  const name = (file.originalname || "").toLowerCase();

  const isImage = mime.startsWith("image/");
  const isPDF = mime === "application/pdf" || name.endsWith(".pdf");

  const resourceType = isImage ? "image" : "raw";

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    // 🔥 VERY IMPORTANT: delete local file
    fs.unlinkSync(file.path);

    return result;
  } catch (error) {
    // Cleanup even if upload fails
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};
