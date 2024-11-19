const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profileController');

// Configuración de multer
const storage = multer.memoryStorage(); // Guarda los archivos en memoria como buffer
const upload = multer({ storage }); // Instancia de multer

// Ruta para actualizar el perfil con imagen
router.put('/:id', upload.single('imagen_perfil'), profileController.actualizarPerfil);

// Ruta para obtener el perfil
router.get('/:id', profileController.obtenerPerfil);

module.exports = router;
