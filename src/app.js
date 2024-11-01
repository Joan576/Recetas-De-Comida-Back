// src/app.js

const express = require('express');
const config = require('./config');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Importa las rutas de usuario
const profileRoutes = require('./routes/profileRoutes'); // Importa las rutas de perfil
const path = require('path');

const app = express();

// Configuración
app.set('port', config.app.port);

app.use(cors());
// Middleware para permitir el análisis de cuerpo JSON
app.use(express.json());

// Agregar esta línea para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/usuarios', userRoutes); // Todas las rutas de usuario bajo /api/usuarios
app.use('/api', profileRoutes); // Las rutas de perfil estarán bajo /api/profile

module.exports = app;

