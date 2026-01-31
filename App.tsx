import './global.css';
import React from 'react';
import AddRecipe from 'components/addRecipe';
import { createStaticNavigation } from '@react-navigation/native';
import Home from 'components/home';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RecipeDetails from 'components/recipeDetails';
import { RootStackParamList } from 'types/types';
import { SQLiteProvider } from 'expo-sqlite';

export default function App() {
  const MyTabs = createBottomTabNavigator({
    detachInactiveScreens: true,
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'AddRecipe') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        }

        return <Ionicons name={iconName!} size={size} color={color} />;
      },
      tabBarShowLabel: false,
      tabBarActiveTintColor: '#22c55e',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    }),
    screens: {
      Home: Home,
      AddRecipe: AddRecipe,
    },
  });

  const RootStack = createNativeStackNavigator<RootStackParamList>({
    screens: {
      Tabs: {
        screen: MyTabs,
        options: { headerShown: false },
      },
      RecipeDetails: {
        screen: RecipeDetails,
        options: {
          title: 'Dettaglio ricetta',
        },
      },
    },
  });

  const Navigation = createStaticNavigation(RootStack);
  return (
    <SQLiteProvider
      databaseName="recipes.db"
      onInit={(db) =>
        db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, ingredients TEXT NOT NULL, description TEXT NOT NULL);`)
      }>
      <Navigation />
    </SQLiteProvider>
  );
}
