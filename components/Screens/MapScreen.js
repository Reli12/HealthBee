import React, { useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
export default function MapScreen({ navigation }) {
  const [destination, setDestination] = React.useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [location, setLocation] = React.useState({
    latitude: 45.5600559,
    longitude: 18.6551543,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef(null);
  const moveTo = async (position) => {
    const camera = await mapRef.current.getCamera();
    if (camera) {
      camera.create = position;
      mapRef.current.animateCamera(camera, { duration: 1000 });
    }
  };
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      // console.log(location);
    })();
  }, []);
  return (
    <View style={styles.root}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: "distance",
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          //  console.log(data, details);
          setDestination({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          moveTo(destination);
        }}
        query={{
          key: "AIzaSyCCbIEkvzVqQzbI-6ZZzEJOd9ebu32QWIA",
          language: "en",
          location: `${destination.latitude},${destination.longitude}`,
        }}
        styles={{
          container: {
            flex: 0,
            position: "absolute",
            width: "100%",
            top: 0,
            zIndex: 1,
          },
          listView: { backgroundColor: "white" },
        }}
      />

      <MapView
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        initialRegion={{
          latitude: 45.5606091,
          longitude: 18.6554329,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {location &&
          destination.latitude !== 0 &&
          destination.longitude !== 0 && (
            <MapViewDirections
              origin={location}
              destination={destination}
              apikey={"AIzaSyCCbIEkvzVqQzbI-6ZZzEJOd9ebu32QWIA"}
              strokeWidth={4}
              strokeColor="#6644ff"
            />
          )}
        <Marker
          coordinate={{
            latitude: location ? location.latitude : 37.78825,
            longitude: location ? location.longitude : -122.4324,
          }}
        />

        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: Dimensions.get("window").height, backgroundColor: "#F3F3F4" },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
