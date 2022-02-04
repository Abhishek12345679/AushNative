import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
} from "react-native";
import DrugStore from "../store/CartStore";
import { observer } from "mobx-react";
import Geolocation from "react-native-geolocation-service";
import LocationPicker from "../components/LocationPicker";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import fetchOrders from "../helpers/fetchOrders";

const HomeScreen = observer((props) => {
  const { showActionSheetWithOptions } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [locName, setLocName] = useState("select location");
  const [locData, setLocData] = useState("");

  const geoOptions = {
    enableHighAccuracy: true,
    timeOut: 200000,
    maximumAge: 60 * 60 * 24,
  };

  const geoSuccess = (position) => {
    console.log("Success", position);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCjU7w1itUVJwRQKOctj6HYzySmKgUkX8I`
    )
      .then((response) => response.json())
      .then((data) => {
        let locName = data.results[0].formatted_address.substring(
          data.results[0].formatted_address.indexOf(",") + 1
        );
        console.log(locName);
        setLocData(data);
        setLocName(locName);
      });
  };

  const geoFailure = (error) => {
    console.log("Failure");
    console.log("Error: ", error);
  };

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "ios") {
        Geolocation.requestAuthorization();
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: "whenInUse",
        });
      }

      if (Platform.OS === "android") {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    const fetchingStuff = async () => {
      const orders = await fetchOrders();
      DrugStore.addOrders(orders);

      // fetchAddresses();
    };
    fetchingStuff();
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              marginStart: 10,
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              props.navigation.navigate("Search");
            }}
          >
            <Ionicons name="md-search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginStart: 10,
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              props.navigation.navigate("Cart");
            }}
          >
            <Ionicons name="md-cart" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            {DrugStore.count}
          </Text>
        </View>
      ),
      headerTitle: "Aushadhalay",
      headerStyle: {
        backgroundColor: "#14213d",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerLargeTitle: true,
      headerTintColor: "#fff",
      fontSize: 20,
    });
  }, []);

  const onOpenActionSheet = () => {
    const options = ["Detect Current Location", "Select Manually", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          Geolocation.getCurrentPosition(geoSuccess, geoFailure, geoOptions);
        } else if (buttonIndex === 1) {
          setModalVisible(true);
        }
      }
    );
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <LocationPicker
        location={locName}
        onPress={() => {
          onOpenActionSheet();
        }}
      />
      <Modal
        presentationStyle="formSheet"
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        onDismiss={() => {
          setModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback
          onPressOut={() => {
            setModalVisible(false);
          }}
        >
          <View style={{ flex: 1 }}>
            <GooglePlacesAutocomplete
              textInputProps={{ autoCorrect: false }}
              fetchDetails={true}
              placeholder="Search"
              currentLocation={true}
              currentLocationLabel="Current location"
              onPress={(details) => {
                setLocName(details.formatted_address);
                setModalVisible(false);
              }}
              query={{
                key: "AIzaSyCjU7w1itUVJwRQKOctj6HYzySmKgUkX8I",
                language: "en",
                components: "country:in",
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e335f",
    flexDirection: "column",
    flexGrow: 1,
  },
  scanButton: {
    height: 60,
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
});

const connectedApp = connectActionSheet(HomeScreen);

export default connectedApp;
