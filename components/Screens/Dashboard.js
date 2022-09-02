import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import { Storage } from "expo-storage";

export default function Dashboard({ navigation }) {
  const [name, setName] = useState([""]);
  const [toDo, setToDo] = useState([""]);
  const [flag, setFlag] = useState(false);
  const deleteItem = async (index) => {
    await Storage.removeItem({ key: `${index}` });
  };
  useEffect(() => {
    const getKey = async () => {
      const keys = await Storage.getAllKeys();
      keys.forEach(async (key) => {
        const item = JSON.parse(await Storage.getItem({ key: `${key}` }));
        //await Storage.removeItem({ key: `${key}` });
        setName([item.name, ...name]);
        name.push(item.name);
        setToDo([item.toDo, ...toDo]);
        toDo.push(item.toDo);
        console.log(toDo);
      });
      window.location.reload();
      setFlag(true);
    };
    getKey();
  }, []);
  return (
    <View style={styles.root}>
      <View style={styles.togle}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MedicineScreen")}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>Medicine Scadule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("MapScreen")}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>Navigate</Text>
        </TouchableOpacity>
      </View>
      {name.length > 1 &&
        [...Array(name.length)].map((item, index) => {
          console.log(item);
          if (name[index] != "") {
            return (
              <View style={styles.item} key={index}>
                <View style={styles.itemsFelx2}>
                  <View>
                    <Text style={styles.title}>{name[index]}</Text>
                    <View style={styles.itemsFelx}>
                      <Text style={styles.title}>Task:</Text>
                      <Text style={styles.title}>{toDo[index]}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      deleteItem(name[index]);
                      navigation.navigate("Home");
                    }}
                    style={styles.buttonDelete}
                  >
                    <Text style={styles.appButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: Dimensions.get("window").height, backgroundColor: "#F3F3F4" },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  togle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  item: {
    backgroundColor: "#dbdbdb",
    width: 300,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#777774",
    fontWeight: "bold",
  },
  itemsFelx: {
    display: "flex",
    flexDirection: "row",
  },
  itemsFelx2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonDelete: {
    marginTop: 10,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
});
