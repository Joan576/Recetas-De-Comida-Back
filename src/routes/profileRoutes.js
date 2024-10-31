// src/routes/profileRoutes.js
const express = require('express');
const { obtenerPerfil, actualizarPerfil, upload } = require('../controllers/profileController');

const router = express.Router();

router.get('/profile/:id', obtenerPerfil); // Obtener perfil
router.put('/profile/:id', upload.single('imagen_perfil'), actualizarPerfil); // Actualizar perfil con imagen

module.exports = router;
