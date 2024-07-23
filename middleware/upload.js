const multer = require('multer');
const path = require('path');

// Define the storage location and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Set up the upload middleware
const upload = multer({ storage });

module.exports = upload;
