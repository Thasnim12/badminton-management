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

const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};


const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
}).single("item_image");


const bannerUpload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: limits
}).array('banner_image', 5);

const courtUpload = multer({ 
  storage: storage, 
  fileFilter: fileFilter ,
  limits: limits
}).single('court_image');

const userUpload = multer({
  storage: storage, 
  limits: limits,
  fileFilter: fileFilter 
}).single('profileImage');

module.exports = { upload,bannerUpload, courtUpload, userUpload };
