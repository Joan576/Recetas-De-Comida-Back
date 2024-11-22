const express = require('express');
const config = require('./config');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Importa las rutas de usuario
const profileRoutes = require('./routes/profileRoutes'); // Importa las rutas de perfil
const recipeRoutes = require('./routes/recipesRoutes'); // Importa las rutas de recetas
const path = require('path');

const app = express();

app.use(express.json({ limit: '10mb' })); // Cambia el límite según tus necesidades
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Configuración
app.set('port', config.app.port);

app.use(cors());

// Middleware para analizar el cuerpo JSON
app.use(express.json());

// Agregar esta línea para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/usuarios', userRoutes); // Todas las rutas de usuario bajo /api/usuarios
app.use('/api/profile', profileRoutes); // Las rutas de perfil estarán bajo /api/profile
app.use('/api', recipeRoutes); // Todas las rutas de recetas y entradas bajo /api

module.exports = app;
