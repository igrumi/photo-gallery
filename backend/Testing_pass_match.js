const bcrypt = require('bcryptjs');

const hashedPassword = 'INSERTAR HASH'; // La contraseña hasheada de la base de datos
const password = 'INSERTAR PASSWORD'; // La contraseña proporcionada

bcrypt.compare(password, hashedPassword, (err, isMatch) => {
  if (err) {
    console.error('Error comparando las contraseñas:', err);
  } else {
    console.log(`¿Las contraseñas coinciden?: ${isMatch}`);
  }
});
