import { Button, StyleSheet, Text, View, Image } from "react-native";
import { getDatabase, ref, onValue, set } from "firebase/database";

export default function Home({ navigation }) {
  function storeHighScore(userId, score) {
    const db = getDatabase();
    const reference = ref(db, "beer" + userId);
    set(reference, {
      highscore: score,
    });
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/BeeImageLogo.jpg")}
      />

      <Button
        style={styles.button}
        title="Enter Health Bee "
        onPress={() => navigation.navigate("Dashboard")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 120,
    margin: 20,
  },
  button: {
    borderRadius: 10,
  },
});
