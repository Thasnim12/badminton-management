const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'badminton',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => {
      const fileName = Date.now() + path.extname(file.originalname);
      return fileName.split('.')[0];
    },
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
}).single("item_image");

const bannerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
}).array("banner_image", 10);

const courtUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
}).single("court_image");

const userUpload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
}).single("profileImage");

const staffUpload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
}).single("staff_image");

module.exports = { upload, bannerUpload, courtUpload, userUpload, staffUpload };
