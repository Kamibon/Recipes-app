import { useNavigation } from '@react-navigation/native';
import {
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'types/types';
import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from 'types/recipe';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();

  const db = SQLite.useSQLiteContext();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecipes = async (filter = '') => {
    setIsLoading(true);
    const loadedRecipes = await db.getAllAsync<Recipe>(
      'SELECT * FROM recipes WHERE title LIKE ?',
      `%${filter!}%`
    );
    setIsLoading(false);
    setRecipes(loadedRecipes);
  };

  const deleteRecipe = async (id: number) => {
    Alert.alert('Vuoi davvero eliminare questa ricetta?', 'La eliminiamo?', [
      {
        text: 'Si',
        onPress: async () => {
          try {
            await db.runAsync('DELETE FROM recipes WHERE id = $id', { $id: id });
            Alert.alert('Eliminazione avvenuta con successo!');
            loadRecipes(searchText);
          } catch (error) {
            Alert.alert('Eliminazione non riuscita');
          }
        },
      },
      {
        text: 'No',
        onPress: () => {
          return;
        },
      },
    ]);
  };

  useEffect(() => {
    if(searchText.trim())
    setTimeout(() => {
      try {
        loadRecipes(searchText);
      } catch (error) {}
    }, 3000);
  }, [searchText]);

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="mb-4 text-3xl font-bold">🍝 Le mie ricette</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              colors={['#ff0000', '#00ff00', '#0000ff']}
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await loadRecipes(searchText);
                setRefreshing(false);
              }}
            />
          }
          ListHeaderComponent={
            <View className="mx-4 my-2 flex-row items-center rounded-full bg-gray-200 px-4 py-2">
              <Ionicons name="search" size={20} color="#888" className="mr-2" />
              <TextInput
                className="flex-1 text-gray-900"
                placeholder={'Cerca qui le tue ricette'}
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#888"
              />
            </View>
          }
          ListEmptyComponent={<Text>Nessun risultato trovato :|</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-3 rounded-xl bg-gray-100 p-4"
              onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}>
              <View className="flex-row justify-between">
                <Text className="text-xl font-semibold">{item.title}</Text>
                <Ionicons onPress={() => deleteRecipe(item.id)} name="trash" size={20} />
              </View>
              <Text className="text-gray-500">
                {item.description.substring(0, 20).concat('...')}
              </Text>
              <Text>Ingredienti: {item.ingredients.substring(0, 50).concat('...')}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        className="mt-4 items-center rounded-full bg-green-500 p-4"
        onPress={() => navigation.navigate('AddRecipe')}>
        <Text className="text-lg font-bold text-white">+ Aggiungi ricetta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
