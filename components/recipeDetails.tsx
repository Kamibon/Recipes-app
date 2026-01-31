import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Recipe } from 'types/recipe';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const RecipeDetails = ({ route }: any) => {
  const { recipe }: { recipe: Recipe } = route.params;

  const speak = () => {
    setStopped(false);
    const thingToSay = `Questa è la ricetta per ${recipe.title}. Avrai bisogno di questi ingredienti: ${recipe.ingredients}. Passiamo adesso al procedimento. ${recipe.description}`;
    Speech.speak(thingToSay);
  };

  const createAndSharePdf = async () => {
    const html = ` <html>
    <body style="font-family: Helvetica; padding: 20px;">
      <h1>${recipe.title}</h1>
      <h2>Ingredienti</h2>
      <p> ${recipe.ingredients}</p>
      <h2>Procedimento</h2>
      <p> ${recipe.description}</p>
    </body>
  </html>`;

    const { uri } = await Print.printToFileAsync({
      html,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert('La condivisione non è disponibile su questo dispositivo');
    }
  };

  const [stopped, setStopped] = useState(true);

  useEffect(() => {
    if (stopped) Speech.stop();
  }, [stopped]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setStopped(true);
        Speech.stop();
      };
    }, [])
  );

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="mb-2 text-3xl font-bold">{recipe.title}</Text>
        <Ionicons color={'gray'} onPress={() => createAndSharePdf()} name="share" size={20} />
      </View>
      <ScrollView>
        <Text className="mb-2 text-xl font-semibold">Ingredienti</Text>
        <Text className="mb-4 text-gray-700">{recipe.ingredients}</Text>

        <Text className="mb-2 text-xl font-semibold">Procedimento</Text>
        <Text className="text-gray-700">{recipe.description}</Text>
      </ScrollView>
      <TouchableOpacity
        onPress={() => (stopped ? speak() : setStopped(true))}
        className=" mx-auto mt-4 size-12 items-center justify-center rounded-full bg-green-500">
        <Ionicons size={20} color={'white'} name={stopped ? 'play' : 'pause'} />
      </TouchableOpacity>
    </View>
  );
};

export default RecipeDetails;
