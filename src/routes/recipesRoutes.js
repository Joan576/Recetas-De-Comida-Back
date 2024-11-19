const express = require('express');
const {
  getPostres,
  createPostres,
  getEntradas,
  createEntrada,
  getPlatos,
  createPlatos,
  getBebidas,
  createBebidas,
} = require('../controllers/recipesController');

const router = express.Router();

// Rutas para postres
router.get('/postres', getPostres);
router.post('/postres', createPostres);

// Rutas para entradas
router.get('/entradas', getEntradas);
router.post('/entradas', createEntrada);

// Rutas para platos fuertes
router.get('/platos-fuertes', getPlatos);
router.post('/platos-fuertes', createPlatos);

// Rutas para bebidas
router.get('/bebidas', getBebidas);
router.post('/bebidas', createBebidas);

module.exports = router;
