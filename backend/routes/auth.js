const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para port 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      console.log(`Intentando iniciar sesión con email: ${email}`);
  
      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Contraseña proporcionada: ${password}`);
      console.log(`Contraseña hasheada en la base de datos: ${user.password}`);
      console.log(`¿Coinciden las contraseñas?: ${isMatch}`);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
  
      // Generar nuevo token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ token });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).send('Error al iniciar sesión');
    }
  });
  


// Ruta para enviar una nueva contraseña por correo
router.post('/send-new-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Nueva contraseña',
      text: `Tu nueva contraseña es: ${newPassword}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Nueva contraseña enviada al correo electrónico' });
  } catch (error) {
    console.error('Error al enviar nueva contraseña:', error);
    res.status(500).send('Error al enviar nueva contraseña');
  }
});

module.exports = router;
