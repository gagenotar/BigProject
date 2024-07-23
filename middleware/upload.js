const multer = require('multer');
const path = require('path');

// Define the storage location and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Set up the upload middleware
const upload = multer({ storage });

module.exports = upload;
