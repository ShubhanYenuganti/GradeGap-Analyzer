const express = require('express');
const router = express.Router();
const multer = require('multer');
const Class = require('../models/Class');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

require('dotenv').config();

// AWS Config
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  })
});

// POST /api/classes/create
router.post('/create', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newClass = new Class({ title, description });
    await newClass.save();
    res.json(newClass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// POST /api/classes/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  const { classId, category } = req.body;

  try {
    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const newFile = {
      filename: req.file.key,         // S3 file key
      category,
      path: req.file.location         // Public S3 URL
    };

    existingClass.files.push(newFile);
    await existingClass.save();

    res.json({ 
      message: 'File uploaded successfully', 
      fileUrl: req.file.location      // Send URL back to frontend
    });

  } catch (error) {
    console.error('UPLOAD ERROR:', error);   // <--- add this
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// GET /api/classes/insights/:classId
router.get('/insights/:classId', async (req, res) => {
  const { classId } = req.params;

  try {
    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({ insights: existingClass.insights });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

module.exports = router;