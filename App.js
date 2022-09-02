import { StyleSheet } from "react-native";
import { initializeApp } from "firebase/app";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Container from "./components/Screens/Container";
import Home from "./components/Screens/Home";
import Dashboard from "./components/Screens/Dashboard";
import MapScreen from "./components/Screens/MapScreen";
import MedicineScreen from "./components/Screens/MedicineScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyA1xDvy47Q73_vwXdtardsEYerhIweGBFc",
    authDomain: "healtbeeproduction.firebaseapp.com",
    databaseURL:
      "https://healtbeeproduction-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "healtbeeproduction",
    storageBucket: "healtbeeproduction.appspot.com",
    messagingSenderId: "706543717058",
    appId: "1:706543717058:web:3df923748c17161ba1895b",
  };
  initializeApp(firebaseConfig);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="MedicineScreen" component={MedicineScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
