// src/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/', userController.guardarUsuario); // POST /api/usuarios
router.get('/', userController.obtenerUsuarios);  // GET /api/usuarios
router.post('/login', userController.loginUsuario); // POST /api/usuarios/login
router.post('/register', userController.guardarUsuario); // POST /api/usuarios/register


module.exports = router;
