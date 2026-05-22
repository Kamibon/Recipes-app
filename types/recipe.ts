export interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  description: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
}

export type CreateRecipeRequest = Omit<Recipe, 'id'>;

