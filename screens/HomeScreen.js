// TODO: upgrade to 0.63

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  AppState,
  Image,
  Button,
} from "react-native";

import * as Firebase from "firebase";

import { showMessage } from "react-native-flash-message";

// import { Image } from "react-native-elements";

import DrugStore from "../store/CartStore";
import * as ScreenOrientation from "expo-screen-orientation";

import { observer } from "mobx-react";
import IconBadge from "react-native-icon-badge";
import AsyncStorage from "@react-native-community/async-storage";

import {
  requestNewAuthToken,
  updateAutoLoginData,
} from "../helpers/requestNewAuthToken";

import Geolocation from "@react-native-community/geolocation";
import LocationPicker from "../components/LocationPicker";

const HomeScreen = observer((props) => {
  const { navigation } = props;
  const [headerImg, setHeaderImg] = useState(
    "https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png"
  );

  const uid = DrugStore.userCredentials.uid;

  const appState = useRef(AppState.currentState);

  const [locName, setLocName] = useState("Select Location");

  const geoSuccess = (position) => {
    console.log("Success", position);

    /**
     * revert this back in production,
     * this is just to show me my home address
     */

    // fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCjU7w1itUVJwRQKOctj6HYzySmKgUkX8I`
    // )
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=26.704669,89.087195&key=AIzaSyCjU7w1itUVJwRQKOctj6HYzySmKgUkX8I`
    )
      .then((response) => response.json())
      .then((data) => {
        let locName = data.results[0].formatted_address.substring(
          data.results[0].formatted_address.indexOf(",") + 1
        );
        console.log(locName);
        setLocName(locName);
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

  // useEffect(() => {
  //   Geolocation.getCurrentPosition(geoSuccess, geoFailure, geoOptions);
  // }, []);

  // cloudinary is super slow in fetching images
  const getDP = async () => {
    const response = await fetch("https://images-api-v1.herokuapp.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
      }),
    });
    const resData = await response.json();
    return resData;
    // console.log("DP - ", resData);
  };

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
    // // setAppStateVisible(appState.current);
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

    getDP().then((data) => {
      console.log(data);
      if (data.total_count !== 0) {
        setHeaderImg(data.resources[0].url);
        DrugStore.setPFP(data.resources[0].url);
      }
    });
  }, [DrugStore]);

  useEffect(() => {
    getDP().then((data) => {
      console.log(data);
      if (data.total_count !== 0) {
        // setHeaderImg(data.resources[0].url);
        DrugStore.setPFP(data.resources[0].url);
      }
    });
  }, [navigation]);

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("IN");
        DrugStore.setName(user.displayName);
        // DrugStore.getExtra().then((res) => {
        //   if (res != undefined) {
        //     console.log("RESOURCE", res);
        //     setHeaderImg(res.image);
        //   }
        // });
      }
    });
  }, [navigation]);

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
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Settings");
          }}
        >
          <Image
            source={{
              uri:
                DrugStore.profile.display_picture === " "
                  ? headerImg
                  : DrugStore.profile.display_picture,
            }}
            style={{
              height: 35,
              width: 35,
              marginTop: 0,
              borderRadius: 17.5,
              borderWidth: 1,
              borderColor: "#333",
              // shadowRadius: 10,
              // shadowOpacity: 0.75,
            }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
        >
          <IconBadge
            MainElement={
              <Image
                source={require("../assets/bag.png")}
                style={{ height: 25, width: 25, marginTop: 0 }}
              />
            }
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
      ),
      headerLargeTitle: false,
      headerTitle: "Aushadalay",
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

  // useEffect(() => {
  //   navigation.addListener("focus", () => {
  //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  //   });

  //   navigation.addListener("blur", () => {
  //     ScreenOrientation.unlockAsync();
  //   });
  // }, [navigation]);

  // useEffect(() => {
  //   // console.log("Creds - ", DrugStore.userCredentials);
  // }, []);

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === "ios" ? (
        <StatusBar barStyle="dark-content" />
      ) : (
        <StatusBar barStyle="light-content" />
      )}
      <View
        style={{
          ...styles.container,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ paddingHorizontal: 25, marginTop: 20 }}>
          <Text style={{ fontSize: 30 }}>Welcome back, </Text>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "purple" }}>
            {DrugStore.profile.name.trim()}
          </Text>
          <LocationPicker
            location={locName}
            onPress={() => {
              Geolocation.getCurrentPosition(
                geoSuccess,
                geoFailure,
                geoOptions
              );
            }}
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    // alignItems: "center",
  },
  scanButton: {
    height: 150,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 15,
    marginTop: 20,
  },
});

export const IOSScreenOptions = (navData) => {
  return {
    // headerLeft: () => (
    //   <TouchableOpacity
    //     onPress={() => {
    //       navData.navigation.navigate("Settings");
    //     }}
    //   >
    //     <Image
    //       source={{
    //         uri:
    //           // DrugStore.profile.display_picture.length === 1
    //           //   ? "https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png"
    //           // :
    //           DrugStore.profile.display_picture,
    //       }}
    //       style={{
    //         height: 35,
    //         width: 35,
    //         marginTop: 0,
    //         borderRadius: 17.5,
    //         // shadowOpacity: 0.75,
    //       }}
    //     />
    //   </TouchableOpacity>
    // ),
    // headerRight: () => (
    //   <TouchableOpacity
    //     onPress={() => {
    //       navData.navigation.navigate("Cart");
    //     }}
    //   >
    //     <IconBadge
    //       MainElement={
    //         <Image
    //           source={require("../assets/bag.png")}
    //           style={{ height: 25, width: 25, marginTop: 0 }}
    //         />
    //       }
    //       BadgeElement={
    //         <Text style={{ color: "#FFFFFF" }}> {DrugStore.count} </Text>
    //       }
    //       IconBadgeStyle={{
    //         width: 10,
    //         height: 20,
    //         backgroundColor: "purple",
    //         marginTop: 5,
    //       }}
    //       Hidden={DrugStore.count == 0}
    //     />
    //   </TouchableOpacity>
    // ),
    // headerLargeTitle: false,
    // headerTitle: "Aushadalay",
    // औषधालय,
    // headerTitle: `Welcome back, \n ${DrugStore.userCredentials.email.substring(
    //   0,
    //   DrugStore.userCredentials.email.indexOf("@")
    // )}`,
    // headerTitleStyle: { textAlign: "center", flex: 1 },
  };
};

export const AndroidScreenOptions = (navData) => {
  return {
    headerRight: () => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          // justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navData.navigation.navigate("Settings");
          }}
        >
          <Image
            source={{
              uri:
                DrugStore.profile.display_picture.length === 1
                  ? "https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png"
                  : DrugStore.profile.display_picture,
            }}
            style={{
              height: 35,
              width: 35,
              marginTop: 0,
              borderRadius: 17.5,
              // shadowOpacity: 0.75,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        >
          <IconBadge
            MainElement={
              <Image
                source={require("../assets/bag.png")}
                style={{ height: 25, width: 25, marginTop: 0 }}
              />
            }
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
    headerLargeTitle: false,
    headerTitle: "Aushadalay",
    // औषधालय,
    // headerTitle: `Welcome back, \n ${DrugStore.userCredentials.email.substring(
    //   0,
    //   DrugStore.userCredentials.email.indexOf("@")
    // )}`,
    // headerTitleStyle: { textAlign: "center", flex: 1 },
  };
};

export default HomeScreen;

// {"coords": {"accuracy": 5, "altitude": 0, "altitudeAccuracy": -1, "heading": -1, "latitude": 37.785834, "longitude": -122.406417, "speed": -1}, "timestamp": 1605103023554.0972}
