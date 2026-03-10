// import multer from "multer";

// const storage = multer.diskStorage({});

// // File filter for image + pdf
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "application/pdf"
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only images and PDFs are allowed."), false);
//   }
// };

// // 10 MB max file size
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 }
// });

// export default upload;

// middleware/upload.js
import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || "").toLowerCase();
  const name = (file.originalname || "").toLowerCase();

  // Images
  if (mime.startsWith("image/")) return cb(null, true);

  // PDFs
  if (mime === "application/pdf" || name.endsWith(".pdf")) return cb(null, true);

  // DOC / DOCX / TXT (optional)
  const allowedDocs = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  if (allowedDocs.includes(mime)) return cb(null, true);

  cb(new Error("Invalid file type. Only images, PDFs, and documents allowed."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
