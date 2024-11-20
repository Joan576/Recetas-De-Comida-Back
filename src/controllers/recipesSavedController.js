const db = require('../../db');

// Controlador para guardar una receta
const saveRecipe = async (req, res) => {
  const { user_id, recipe_id, recipe_type } = req.body;

  try {
    // Verifica si la receta ya está guardada por el usuario
    const existsQuery = `
      SELECT * FROM saved_recipes
      WHERE user_id = $1 AND recipe_id = $2 AND recipe_type = $3
    `;
    const existsResult = await db.query(existsQuery, [user_id, recipe_id, recipe_type]);

    if (existsResult.rows.length > 0) {
      return res.status(400).json({ message: 'Esta receta ya está guardada' });
    }

    // Inserta la nueva receta en la tabla saved_recipes
    const insertQuery = `
      INSERT INTO saved_recipes (user_id, recipe_id, recipe_type)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const result = await db.query(insertQuery, [user_id, recipe_id, recipe_type]);

    res.status(201).json({ message: 'Receta guardada exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error al guardar la receta:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


const getSavedRecipes = async (req, res) => {
    const userId = req.params.userId; // Obtén el ID del usuario desde los parámetros de la ruta
  
    if (!userId) {
      return res.status(400).json({ message: 'Falta el ID del usuario' });
    }
  
    try {
      const query = `
        SELECT recipe_id, recipe_type
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
  

// Función para eliminar una receta guardada
const deleteSavedRecipe = async (req, res) => {
    const { userId, recipeId } = req.params;
  
    try {
      // Elimina la receta guardada para el usuario
      const result = await db.query(
        'DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2 RETURNING *',
        [userId, recipeId]
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
  deleteSavedRecipe
};
