// TODO: upgrade to 0.63

/**
 * Network status changes to disconnected on switching off system wifi on ios emulator but does not work vice versa
 */

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  AppState,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

import * as Firebase from "firebase";

import { showMessage } from "react-native-flash-message";

import DrugStore from "../store/CartStore";

import { observer } from "mobx-react";
import IconBadge from "react-native-icon-badge";
import AsyncStorage from "@react-native-community/async-storage";

import {
  requestNewAuthToken,
  updateAutoLoginData,
} from "../helpers/requestNewAuthToken";

import Geolocation from "@react-native-community/geolocation";
import LocationPicker from "../components/LocationPicker";

import { connectActionSheet } from "@expo/react-native-action-sheet";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { Ionicons } from "react-native-vector-icons";

const HomeScreen = observer((props) => {
  const { showActionSheetWithOptions } = props;
  const [headerImg, setHeaderImg] = useState(
    "https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png"
  );

  // const uid = DrugStore.userCredentials.uid;

  const appState = useRef(AppState.currentState);

  // const [locName, setLocName] = useState("Select Location");
  const [modalVisible, setModalVisible] = useState(false);
  // const [locData, setLocData] = useState();

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
        // setModalVisible(true);
      });
  };

  const geoFailure = () => {
    console.log("Failure");
  };

  const geoOptions = {
    enableHighAccuracy: true,
    timeOut: 20000,
    maximumAge: 60 * 60 * 24,
  };

  // const [connStatus, setConnStatus] = useState(false);

  // NetInfo.fetch().then((state) => {
  //   console.log("Connection type", state.type);
  //   console.log("Is connected?", state.isConnected);
  // });
  const retrieveUserData = async () => {
    try {
      const loginJSONValue = await AsyncStorage.getItem("login_data");
      const autoLoginCreds = await AsyncStorage.getItem("auto_login_data");

      if (!loginJSONValue || !autoLoginCreds) {
        DrugStore.setDidTryAutoLogin();
      }

      const autoLoginData = JSON.parse(autoLoginCreds);
      const loginData = JSON.parse(loginJSONValue);

      const { email, uid } = loginData;

      const data = { email: email, uid: uid, refToken: autoLoginData.refToken };
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      // start new timer
      // refetch and assign auth token

      retrieveUserData().then((refreshedData) => {
        console.log("userData", refreshedData);

        requestNewAuthToken(refreshedData.refToken).then((data) => {
          DrugStore.initializeUserCredentials(
            data.id_token,
            refreshedData.uid,
            refreshedData.email
          );
          updateAutoLoginData(data.expires_in);
        });
      });
    } else {
      console.log("Background");
      // delete the existing timers
      DrugStore.clearTimer();
    }

    appState.current = nextAppState;
    // setAppStateVisible(appState.current);
    // console.log("AppState", appState.current);
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    DrugStore.fetchOrders();
    DrugStore.fetchAddresses();
    DrugStore.getHealthConditions();
  }, []);

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("user: ", user);
        DrugStore.setName(user.displayName);
      }
    });
  }, []);

  useEffect(() => {
    const retrieve_creds = async () => {
      const auto_login_data = await AsyncStorage.getItem("auto_login_data");
      if (auto_login_data) {
        console.log("Auto_login_data = ", auto_login_data);
        // setTimeout(() => {
        //   console.log("expired");
        // }, 10000);
      }
    };
    retrieve_creds();
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      // headerLeft: () =>
      //   Platform.OS === "ios" && (
      //     <TouchableOpacity
      //       onPress={() => {
      //         props.navigation.navigate("Settings");
      //       }}
      //     >
      //       <Image
      //         source={{
      //           uri:
      //             DrugStore.profile.display_picture === " "
      //               ? headerImg
      //               : DrugStore.profile.display_picture,
      //         }}
      //         style={{
      //           height: 35,
      //           width: 35,
      //           marginTop: 0,
      //           borderRadius: 17.5,
      //           borderWidth: 1,
      //           borderColor: "#333",
      //           // shadowRadius: 10,
      //           // shadowOpacity: 0.75,
      //         }}
      //       />
      //     </TouchableOpacity>
      //   ),
      headerRight: () => (
        //TODO: add ripple effect
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              marginStart: 10,
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "#ccc",
            }}
            onPress={() => {
              // props.navigation.navigate("Settings");
              //TODO: add search screen and (suggestions while typing?)
            }}
          >
            <Ionicons name="md-search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginStart: 5,
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "#ccc",
            }}
            onPress={() => {
              props.navigation.navigate("Cart");
            }}
          >
            <IconBadge
              MainElement={<Ionicons name="md-cart" size={24} color="#fff" />}
              BadgeElement={
                <Text style={{ color: "#FFFFFF" }}> {DrugStore.count} </Text>
              }
              IconBadgeStyle={{
                width: 10,
                height: 20,
                backgroundColor: "purple",
                marginTop: 5,
              }}
              Hidden={DrugStore.count == 0}
            />
          </TouchableOpacity>
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
      // headerTitleAlign: "left",
      headerTintColor: "#fff",
      // headerTitleStyle: {
      //   fontWeight: "bolder",
      //   // fontFamily: "plumpfull",
      fontSize: 20,
      // },
    });
  }, [headerImg]);

  useEffect(() => {
    showMessage({
      message: `Logged in as ${
        !DrugStore.profile.name.length > 0
          ? DrugStore.userCredentials.email
          : DrugStore.profile.name.trim()
      }`,
      type: "success",
      duration: 2000,
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
          //FIXME: returns failure due to billing issues
        } else if (buttonIndex === 1) {
          setModalVisible(true);
        }
      }
    );
  };

  useEffect(() => {
    console.log("modalvisi", modalVisible);
  }, [modalVisible]);

  return (
    <ScrollView
      // keyboardShouldPersistTaps="always"
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      // stickyHeaderIndices={[1]}
    >
      {Platform.OS === "ios" ? (
        <StatusBar barStyle="light-content" />
      ) : (
        <StatusBar barStyle="light-content" backgroundColor="#14213d" />
      )}
      {/* <LocationPicker
        location={locName}
        onPress={() => {
          onOpenActionSheet();
        }}
      /> */}
      <View style={styles.container}></View>

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
              onPress={(data, details) => {
                // 'details' is provided when fetchDetails = true
                console.log(details.formatted_address);
                setLocData({ data, details });
                setLocName(details.formatted_address);
                setModalVisible(false);
                // Alert.alert("yo");
              }}
              query={{
                key: "AIzaSyCjU7w1itUVJwRQKOctj6HYzySmKgUkX8I", //TODO: hide this
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
    // alignItems: "center",
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
