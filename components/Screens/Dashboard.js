import { useEffect, useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Dimensions } from "react-native";
import { Storage } from "expo-storage";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Dashboard({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [name, setName] = useState([""]);
  const [toDo, setToDo] = useState([""]);
  const [flag, setFlag] = useState(false);

  const deleteItem = async (index) => {
    await Storage.removeItem({ key: `${index}` });
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleTime = (timeWhen, dateWhen) => {
    let currentDate = new Date();
    let currentHours = currentDate.getHours();
    let currentMinuts = currentDate.getMinutes();
    let data = new Date(timeWhen);
    let dataWhen = new Date(dateWhen);
    let hrsWhen = data.getHours();
    let minsWhen = data.getMinutes();
    let difMinuts = minsWhen - currentMinuts;
    let difHours = hrsWhen - currentHours;

    if (difMinuts < 0) {
      difMinuts *= -1;
    }
    if (difHours < 0) {
      difHours *= -1;
    }

    return { difHours, difMinuts };
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
        let getDif = handleTime(item.time, item.date);
        schedulePushNotification(item.name, getDif.difHours, getDif.difMinuts);
        console.log(getDif.difHours, getDif.difMinuts);
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
      <SafeAreaView>
        <ScrollView>
          {name.length > 1 &&
            [...Array(name.length)].map((item, index) => {
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
async function schedulePushNotification(body, hours, minutes) {
  const getDifAll = minutes * 60 + hours * 60 * 60;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You must take care for bees",
      body: `${body}`,
    },
    trigger: { seconds: getDifAll },
  });
}
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
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
/** <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Button
          title="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
      </View> */
