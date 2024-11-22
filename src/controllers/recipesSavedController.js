const db = require('../../db');

// Controlador para guardar una receta
const saveRecipe = async (req, res) => {
  const { user_id, recipe_id, recipe_type } = req.body;

  try {
    // Verifica si la receta ya está guardada por el usuario y el tipo
    const existsQuery = `
      SELECT * FROM saved_recipes
      WHERE user_id = $1 AND recipe_id = $2 AND recipe_type = $3
    `;
    const existsResult = await db.query(existsQuery, [user_id, recipe_id, recipe_type]);

    if (existsResult.rows.length > 0) {
      return res.status(400).json({ message: 'Esta receta ya está guardada' });
    }

    // Obtiene la receta desde la tabla correspondiente
    const recipeQuery = `SELECT * FROM ${recipe_type} WHERE id = $1`;
    const recipeResult = await db.query(recipeQuery, [recipe_id]);

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    const recipe = recipeResult.rows[0];

    // Inserta la nueva receta en la tabla saved_recipes
    const insertQuery = `
      INSERT INTO saved_recipes (user_id, recipe_id, recipe_type, nombre, descripcion, imagen, video_url, ingredientes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
    `;
    const insertValues = [
      user_id,
      recipe_id,
      recipe_type,
      recipe.nombre,
      recipe.descripcion,
      recipe.imagen,
      recipe.video_url,
      recipe.ingredientes,
    ];
    const result = await db.query(insertQuery, insertValues);

    res.status(201).json({ message: 'Receta guardada exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error al guardar la receta:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Controlador para obtener las recetas guardadas
const getSavedRecipes = async (req, res) => {
  const userId = req.params.userId; // Obtén el ID del usuario desde los parámetros de la ruta

  if (!userId) {
    return res.status(400).json({ message: 'Falta el ID del usuario' });
  }

  try {
    const query = `
      SELECT recipe_id, recipe_type, nombre, descripcion, imagen, video_url, ingredientes
      FROM saved_recipes
      WHERE user_id = $1
    `;
    const values = [userId];

    const result = await db.query(query, values);

    // Devuelve las recetas guardadas como una lista de objetos
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener las recetas guardadas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Controlador para eliminar una receta guardada
const deleteSavedRecipe = async (req, res) => {
  const { userId, recipeId, recipeType } = req.params;

  try {
    // Elimina la receta guardada para el usuario y el tipo
    const result = await db.query(
      'DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2 AND recipe_type = $3 RETURNING *',
      [userId, recipeId, recipeType]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'La receta guardada no fue encontrada' });
    }

    res.status(200).json({ message: 'Receta guardada eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la receta guardada:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  saveRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
};
