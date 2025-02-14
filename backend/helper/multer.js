const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("item_image");

<<<<<<< HEAD
const profileUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("profileImage");

module.exports = { upload, profileUpload};
=======
const bannerUpload = multer({ 
    storage: storage, 
    fileFilter: fileFilter 
}).array('banner_image', 5);

module.exports = { upload,bannerUpload };
>>>>>>> ce02751c7f9f0c4457eec6f227fe96e405f1e440
