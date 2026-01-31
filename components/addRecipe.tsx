import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';

const AddRecipe = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');

  const db = useSQLiteContext();

  const emptyFields = ()=>{
    setTitle('')
    setIngredients('')
    setDescription('')
  }

  const addRecipe = async () => {
    if(!title.trim() || ingredients.length === 0 || !description.trim()) return
    try {
       await db.runAsync(
      'INSERT INTO recipes (title, description, ingredients) VALUES (?, ?, ?)',
      title,
      description,
    ingredients
    );
    Alert.alert('Ricetta aggiunta con successo!')
    emptyFields()
    } catch (error) {
      Alert.alert('Aggiunta fallita!:(')
    }
   
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="mb-4 text-3xl font-bold">➕ Nuova ricetta</Text>

      <TextInput
        placeholder="Nome ricetta"
        value={title}
        onChangeText={setTitle}
        className="mb-3 rounded-xl border border-gray-300 p-3"
      />

      <TextInput
        placeholder="Ingredienti"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
        className="mb-3 h-24 rounded-xl border border-gray-300 p-3"
      />

      <TextInput
        placeholder="Procedimento"
        value={description}
        onChangeText={setDescription}
        multiline
        className="mb-3 h-32 rounded-xl border border-gray-300 p-3"
      />

      <TouchableOpacity
        disabled={!title.trim() || ingredients.length === 0 || !description.trim()}
        className="items-center rounded-full bg-green-500 p-4"
        onPress={() => addRecipe()}>
        <Text className="text-lg font-bold text-white">Salva</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddRecipe;
