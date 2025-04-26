const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const Class = require('../models/Class');

// AWS Config
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();


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
router.post('/upload', (req, res, next) => {
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
  }).single('file');

  upload(req, res, async function (err) {
    if (err) {
      console.error('UPLOAD ERROR:', err);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    const { classId, category } = req.body;

    try {
      const existingClass = await Class.findById(classId);
      if (!existingClass) {
        return res.status(404).json({ error: 'Class not found' });
      }

      const newFile = {
        filename: req.file.key,        
        category,
        path: req.file.location         
      };

      existingClass.files.push(newFile);
      await existingClass.save();

      res.json({ 
        message: 'File uploaded successfully', 
        fileUrl: req.file.location      
      });

    } catch (error) {
      console.error('UPLOAD ERROR:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });
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

// GET /api/classes/getClassId/:title
router.get('/getClassId/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const existingClass = await Class.findOne({
      title: { $regex: `^${title.trim()}$`, $options: 'i' }
    });

    if (!existingClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({ classId: existingClass._id });
  } catch (error) {
    console.error('GET CLASS ID ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch class ID' });
  }
});

// ✅ GET /api/classes/all
router.get('/all', async (req, res) => {
  try {
    const classes = await Class.find();  
    res.json(classes);                   
  } catch (error) {
    console.error('GET ALL CLASSES ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});
