import * as SQLite from 'expo-sqlite';
import { CreateRecipeRequest, Ingredient, Recipe } from 'types/recipe';

export const initDb = async () => {
  const db = await SQLite.openDatabaseAsync('recipes.db');

  await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, ingredients TEXT NOT NULL, description TEXT NOT NULL);`);

return db;
};

export async function createRecipe(db: SQLite.SQLiteDatabase, recipe: CreateRecipeRequest) {
  const result = await db.runAsync(
    'INSERT INTO recipes (title, description, ingredients) VALUES (?, ?, ?)',
    recipe.title,
    recipe.description,
    recipe.ingredients
  );
  return result.lastInsertRowId;
}

export async function deleteRecipe(db: SQLite.SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM recipes WHERE id = ?', id);
}

export async function getAllRecipes(db: SQLite.SQLiteDatabase): Promise<Recipe[]> {
  const rows: Recipe[] = await db.getAllAsync('SELECT * FROM recipes');
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    ingredients: r.ingredients,
  }));
}

export async function getRecipeById(db: SQLite.SQLiteDatabase, id: number): Promise<Recipe | null> {
  const row: Recipe | null = await db.getFirstAsync('SELECT * FROM recipes WHERE id = ?', id);
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ingredients: row.ingredients.toString(),
  };
}

export async function updateRecipe(db: SQLite.SQLiteDatabase, recipe: Recipe) {
  await db.runAsync(
    'UPDATE recipes SET title = ?, description = ?, ingredients = ? WHERE id = ?',
    recipe.title,
    recipe.description,
   recipe.ingredients,
    recipe.id
  );
}
