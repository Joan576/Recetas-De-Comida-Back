// src/controllers/userController/userController.js

const db = require('../../../db'); // Ajusta la ruta según la estructura de tu proyecto




// Función para iniciar sesión
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar que los campos estén presentes
    if (!email || !password) {
      return res.status(400).json({
        message: 'Correo y contraseña son obligatorios',
      });
    }

    // Verificar si el correo existe
    const result = await db.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(400).json({
        message: 'Correo o contraseña incorrectos',
      });
    }

    // Verificar si la contraseña es correcta
    if (usuario.contraseña !== password) {
      return res.status(400).json({
        message: 'Correo o contraseña incorrectos',
      });
    }

    // Si el inicio de sesión es exitoso
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: { id: usuario.id, username: usuario.nombre_usuario, email: usuario.correo }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};




// Función para validar el formato del correo electrónico
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex simple para validar el formato del correo
  return regex.test(email);
};

// Guardar un nuevo usuario
const guardarUsuario = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar que todos los campos estén presentes
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios',
      });
    }

    // Verificar formato del correo electrónico
    if (!validarEmail(email)) {
      return res.status(400).json({
        message: 'Formato de correo electrónico inválido',
      });
    }

    // Comprobar si el correo ya está en uso
    const emailExistente = await db.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    if (emailExistente.rows.length > 0) {
      return res.status(400).json({
        message: 'Este correo electrónico ya está registrado. Por favor, utiliza otro.',
      });
    }

    // Inserción del usuario en la base de datos
    const query = 'INSERT INTO usuarios (nombre_usuario, correo, contraseña) VALUES ($1, $2, $3) RETURNING *';
    const values = [username, email, password];

    const result = await db.query(query, values);
    const newUser = result.rows[0];

    // Respuesta exitosa
    res.status(201).json({
      message: '¡Registro exitoso! Bienvenido, ' + username + '!',
      user: newUser,
    });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({
      message: 'Error al registrar el usuario',
      error: error.message,
    });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    console.log('Intentando obtener los usuarios de la base de datos...');
    
    const result = await db.query('SELECT * FROM usuarios');

    console.log('Resultado de la consulta:', result);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron usuarios',
      });
    }

    // Si se obtienen usuarios correctamente
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener los usuarios',
      error: error.message,
    });
  }
};

module.exports = {
  guardarUsuario,
  obtenerUsuarios,
  loginUsuario, // Añadir la nueva función de login
};
