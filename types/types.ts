import { NavigatorScreenParams } from "@react-navigation/native";
import { Recipe } from "./recipe";

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  RecipeDetails: {
    recipe: Recipe
  };
};

export type TabParamList = {
  Home: undefined;
  AddRecipe: undefined;
};