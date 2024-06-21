const express = require('express');
const Memory = require('../models/Memory');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuración de AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'sa-east-1', // Cambia esto si estás usando una región diferente
});

const s3 = new AWS.S3();

router.get('/', async (req, res) => {
  try {
    const memories = await Memory.find();
    res.json(memories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    res.status(500).send('Error fetching memories');
  }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
      console.log('Received upload request');
      const { title, category, date, description } = req.body;
      let imageUrl = '';
  
      // Convertir fecha de "DD-MM-YYYY" a "YYYY-MM-DD"
      const [day, month, year] = date.split('-');
      const formattedDate = `${year}-${month}-${day}`;
  
      if (req.file) {
        console.log('File received:', req.file);
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: Date.now().toString() + path.extname(req.file.originalname),
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
          ACL: 'public-read', // Añadir ACL para acceso público
        };
  
        const uploadResult = await s3.upload(params).promise();
        console.log('File uploaded to S3:', uploadResult);
        imageUrl = uploadResult.Location;
      }
  
      const newMemory = new Memory({ title, category, date: formattedDate, description, imageUrl });
      await newMemory.save();
      res.status(201).json(newMemory);
    } catch (error) {
      console.error('Error creating memory:', error.message, error.stack);
      res.status(500).send('Error creating memory');
    }
  });
  
  module.exports = router;
  

module.exports = router;
