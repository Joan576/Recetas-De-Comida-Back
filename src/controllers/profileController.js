const db = require('../../db');
const admin = require('../config/firebaseConfig'); // Importa la configuración de Firebase
const bucket = admin.storage().bucket(); // Usa el bucket de Firebase Storage

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
    console.log('Perfil recuperado:', usuario); // Verifica que la URL sea correcta aquí
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener el perfil:', error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para subir una imagen a Firebase Storage y obtener la URL de descarga
const uploadImageToFirebase = async (base64Image) => {
  try {
    const base64EncodedImageString = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
    const fileName = `recetas-comida-profile/${Date.now()}-profile.jpg`;
    const file = bucket.file(fileName);

    // Sube la imagen a Firebase Storage
    await file.save(imageBuffer, {
      contentType: 'image/jpeg',
      public: true,
    });

    // Construye la URL pública de la imagen
    const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
    console.log('Imagen subida con éxito:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir la imagen a Firebase Storage:', error);
    throw error;
  }
};

// Función para actualizar el perfil del usuario
const actualizarPerfil = async (req, res) => {
  try {
    const { username, description, imagen_perfil } = req.body;
    let imageUrl = null;

    // Verifica si hay una imagen en Base64 para subir y obtiene la URL
    if (imagen_perfil) {
      imageUrl = await uploadImageToFirebase(imagen_perfil);
    }

    // Obtén la imagen actual desde la base de datos si no se envió una nueva
    const userId = req.params.id;
    const existingUserResult = await db.query(
      'SELECT imagen_perfil FROM usuarios WHERE id = $1',
      [userId]
    );

    if (existingUserResult.rows.length > 0 && !imagen_perfil) {
      imageUrl = existingUserResult.rows[0].imagen_perfil; // Usa la imagen existente si no se proporcionó una nueva
    }

    // Actualiza la base de datos con los nuevos datos, incluyendo la URL de la imagen
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

module.exports = { obtenerPerfil, actualizarPerfil };