const multer = require("multer");

// Use memory storage for Vercel
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
