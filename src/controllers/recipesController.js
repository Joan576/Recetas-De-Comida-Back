const db = require('../../db');

// Controlador para obtener todos los postres
const getPostres = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM postres');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener postres:', error);
    res.status(500).json({ error: 'Error al obtener los postres' });
  }
};

// Controlador para crear un nuevo postre
const createPostres = async (req, res) => {
  const { nombre, descripcion, imagen, video_url, ingredientes } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO postres (nombre, descripcion, imagen, video_url, ingredientes) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion, imagen, video_url, ingredientes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear postre:', error);
    res.status(500).json({ error: 'Error al crear el postre' });
  }
};

// Controlador para obtener todas las entradas
const getEntradas = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM entradas');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener entradas:', error);
    res.status(500).json({ error: 'Error al obtener las entradas' });
  }
};

// Controlador para crear una nueva entrada
const createEntrada = async (req, res) => {
  const { nombre, descripcion, imagen, video_url, ingredientes } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO entradas (nombre, descripcion, imagen, video_url, ingredientes) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion, imagen, video_url, ingredientes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear entrada:', error);
    res.status(500).json({ error: 'Error al crear la entrada' });
  }
};

// Controlador para obtener todos los platos fuertes
const getPlatos = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM platos_fuertes');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener platos fuertes:', error);
    res.status(500).json({ error: 'Error al obtener los platos fuertes' });
  }
};

// Controlador para crear un nuevo plato fuerte
const createPlatos = async (req, res) => {
  const { nombre, descripcion, imagen, video_url, ingredientes } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO platos_fuertes (nombre, descripcion, imagen, video_url, ingredientes) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion, imagen, video_url, ingredientes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear plato fuerte:', error);
    res.status(500).json({ error: 'Error al crear el plato fuerte' });
  }
};

// Controlador para obtener todas las bebidas
const getBebidas = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM bebidas');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener bebidas:', error);
    res.status(500).json({ error: 'Error al obtener las bebidas' });
  }
};

// Controlador para crear una nueva bebida
const createBebidas = async (req, res) => {
  const { nombre, descripcion, imagen, video_url, ingredientes } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO bebidas (nombre, descripcion, imagen, video_url, ingredientes) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion, imagen, video_url, ingredientes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear bebida:', error);
    res.status(500).json({ error: 'Error al crear la bebida' });
  }
};

module.exports = {
  getPostres,
  createPostres,
  getEntradas,
  createEntrada,
  getPlatos,
  createPlatos,
  getBebidas,
  createBebidas,
};
