const bcrypt = require('bcrypt');
const db = require('../../db');

// Función para validar el formato del correo electrónico
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Función para registrar un nuevo usuario
const guardarUsuario = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ message: 'Formato de correo electrónico inválido' });
    }

    const emailExistente = await db.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    if (emailExistente.rows.length > 0) {
      return res.status(400).json({ message: 'Este correo electrónico ya está registrado. Por favor, utiliza otro.' });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO usuarios (nombre_usuario, correo, contraseña) VALUES ($1, $2, $3) RETURNING *';
    const values = [username, email, hashedPassword];
    const result = await db.query(query, values);

    res.status(201).json({ message: '¡Registro exitoso! Bienvenido, ' + username + '!', user: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};


const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    const result = await db.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    const usuario = result.rows[0];

    if (!usuario) {
      console.log('Usuario no encontrado');
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Mostrar la contraseña en la base de datos y la ingresada
    console.log('Contraseña en base de datos:', usuario.contraseña);
    console.log('Contraseña ingresada:', password);

    // Prueba de comparación de contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.contraseña);
    console.log('Resultado de bcrypt.compare:', passwordMatch);

    if (!passwordMatch) {
      console.log('Las contraseñas no coinciden');
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: { id: usuario.id, username: usuario.nombre_usuario, email: usuario.correo }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM usuarios');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

module.exports = {
  guardarUsuario,
  obtenerUsuarios,
  loginUsuario
};
