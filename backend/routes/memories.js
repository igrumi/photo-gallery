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
  region: 'sa-east-1',
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
        ACL: 'public-read',
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

// Actualizar un recuerdo
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, date, description } = req.body;
    let updateData = { title, category, date, description };

    if (req.file) {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: Date.now().toString() + path.extname(req.file.originalname),
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
      };

      const uploadResult = await s3.upload(params).promise();
      updateData.imageUrl = uploadResult.Location;
    }

    const updatedMemory = await Memory.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedMemory);
  } catch (error) {
    console.error('Error updating memory:', error);
    res.status(500).send('Error updating memory');
  }
});

// Eliminar un recuerdo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Memory.findByIdAndDelete(id);
    res.json({ message: 'Memory deleted' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    res.status(500).send('Error deleting memory');
  }
});

module.exports = router;
