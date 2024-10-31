// src/controllers/profileController.js
const db = require('../../db'); // Asegúrate de que esta ruta sea correcta
const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Función para obtener el perfil del usuario
const obtenerPerfil = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await db.query(
      'SELECT nombre_usuario, descripcion, imagen_perfil FROM usuarios WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    usuario.imagen_perfil = usuario.imagen_perfil
      ? `http://localhost:4000/${usuario.imagen_perfil}`
      : null; // Añadir la URL completa de la imagen si existe

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener el perfil:', error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para actualizar el perfil del usuario
const actualizarPerfil = async (req, res) => {
  try {
    const { username, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imagen_perfil;

    const query = `
      UPDATE usuarios
      SET nombre_usuario = $1, descripcion = $2, imagen_perfil = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [username, description, imageUrl, req.params.id];

    const result = await db.query(query, values);
    res.status(200).json({ message: 'Perfil actualizado con éxito', user: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { obtenerPerfil, actualizarPerfil, upload };
