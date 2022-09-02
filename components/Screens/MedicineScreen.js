import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { getDatabase, ref, set } from "firebase/database";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Storage } from "expo-storage";

const MedicineScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [toDo, setToDo] = useState("");

  const [datePicker, setDatePicker] = useState(false);

  const [date, setDate] = useState(new Date());

  const [timePicker, setTimePicker] = useState(false);

  const [time, setTime] = useState(new Date(Date.now()));

  function showDatePicker() {
    setDatePicker(true);
  }
  function showTimePicker() {
    setTimePicker(true);
  }
  function onDateSelected(event, value) {
    setDate(value);
    console.log(value);
    setDatePicker(false);
  }
  function onTimeSelected(event, value) {
    setTime(value);
    setTimePicker(false);
  }
  console.log(time + "time");
  async function writeUserData(name, toDos, dateValue, time) {
    const db = getDatabase();
    set(ref(db, "workData/" + name), {
      name: name,
      toDo: toDos,
      date: dateValue,
      time: time,
    });
    await Storage.setItem({
      key: `${name}`,
      value: JSON.stringify({
        name: name,
        toDo: toDos,
        date: dateValue,
        time: time,
      }),
    });
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter name of apiary"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="What needed to be done"
          value={toDo}
          onChangeText={(text) => setToDo(text)}
          style={styles.input}
        />
      </View>
      {datePicker && (
        <DateTimePicker
          value={date}
          mode={"date"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          format="YYYY-MM-DD"
          onChange={onDateSelected}
        />
      )}

      {!datePicker && (
        <View style={{ margin: 10 }}>
          <TouchableOpacity
            onPress={() => {
              showDatePicker();
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Set date</Text>
          </TouchableOpacity>
        </View>
      )}
      {timePicker && (
        <DateTimePicker
          value={time}
          mode={"time"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={false}
          onChange={onTimeSelected}
        />
      )}
      {!timePicker && (
        <View style={{ margin: 10 }}>
          <TouchableOpacity onPress={showTimePicker} style={styles.button}>
            <Text style={styles.buttonText}>Set hours</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            writeUserData(name, toDo, date.toString(), time.toString());
            navigation.navigate("Home");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Set reminder</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 120,
    margin: 20,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderColor: "#56213c",
    borderWidth: 1,
  },
  buttonText: {},
  inputContainer: {
    width: "80%",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
export default MedicineScreen;
