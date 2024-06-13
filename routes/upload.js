const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuration de stockage pour Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialisation de l'upload avec Multer
const upload = multer({ storage: storage });

// Route pour l'upload des images
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    res.send(`Image uploaded successfully: ${req.file.filename}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while uploading the image.');
  }
});

module.exports = router;
