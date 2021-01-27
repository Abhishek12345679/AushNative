// TODO: upgrade to 0.63

/**
 * Network status changes to disconnected on switching off system wifi on ios emulator but does not work vice versa
 */

// FIX: uploading DP error - `{"error": {"message": "Unsupported source URL:  "}}`

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
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
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

import { connectActionSheet } from "@expo/react-native-action-sheet";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const HomeScreen = observer((props) => {
  const { navigation, showActionSheetWithOptions } = props;
  const [headerImg, setHeaderImg] = useState(
    "https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png"
  );

  const uid = DrugStore.userCredentials.uid;

  const appState = useRef(AppState.currentState);

  const [locName, setLocName] = useState("Select Location");
  const [modalVisible, setModalVisible] = useState(false);
  const [locData, setLocData] = useState();

  const geoSuccess = (position) => {
    console.log("Success", position);

    /**
     * revert this back in production,
     * this is just to show me my home address
     */

    // fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=26.704669,89.087195&key=AIzaSyCjU7w1itUVJwRQKOctj6HYzySmKgUkX8I`
    // )
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

  // useEffect(() => {
  //   // Subscribe
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     // console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //     setConnStatus(state.isConnected);
  //   });
  //   return () => {
  //     // Unsubscribe
  //     unsubscribe();
  //   };
  // }, []);

  // NetInfo.fetch().then((state) => {
  //   console.log("Connection type", state.type);
  //   console.log("Is connected?", state.isConnected);
  // });

  // cloudinary is super slow in fetching images
  const getDP = async () => {
    const response = await fetch("https://images-api-v1.herokuapp.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
        folder_name: "Profile_Pictures",
      }),
    });
    const resData = await response.json();
    console.log("DP - ", resData);
    return resData;
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
      // retrieveUserData().then((refreshedData) => {
      // const timer = setInterval(() => {
      //   requestNewAuthToken(refreshToken).then((data) => {
      //     DrugStore.initializeUserCredentials(
      //       data.id_token,
      //       DrugStore.userCredentials.uid,
      //       DrugStore.userCredentials.email
      //     );
      //     updateAutoLoginData(data.expires_in);
      //   });

      //   console.log("called requestNewToken");
      //   console.log("expires in ");
      // }, 3600 * 1000);
      // DrugStore.clearTimer();
      // DrugStore.startTimer(timer);
      // });
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
      // headerTitle: "Aushadhalay",
      headerStyle: {
        backgroundColor: "#fff",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerLargeTitle: true,
      // headerTitleAlign: "left",
      // headerTintColor: "#000",
      // headerTitleStyle: {
      //   fontWeight: "bolder",
      //   // fontFamily: "plumpfull",
      //   fontSize: 20,
      // },
    });
  }, [headerImg]);

  // useEffect(() => {
  //   Platform.OS === "android" ? AndroidScreenOptions : IOSScreenOptions;
  // }, [headerImg]);

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
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ["Detect Current Location", "Select Manually", "Cancel"];
    // const destructiveButtonIndex = 2;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        // destructiveButtonIndex,
      },
      (buttonIndex) => {
        // Do something here depending on the button index selected
        if (buttonIndex === 0) {
          Geolocation.getCurrentPosition(geoSuccess, geoFailure, geoOptions);
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
      keyboardShouldPersistTaps="always"
      style={{ backgroundColor: "#fff" }}
      contentContainerStyle={{ flexGrow: 1 }}
      stickyHeaderIndices={[1]}
    >
      {Platform.OS === "ios" ? (
        <StatusBar barStyle="dark-content" />
      ) : (
        <StatusBar barStyle="light-content" />
      )}
      <LocationPicker
        location={locName}
        onPress={() => {
          onOpenActionSheet();
        }}
      />
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
          {/* <Text>
            ConnStatus:{connStatus === true ? "connected" : "disconnected"}
          </Text> */}
          {/* change the UI of the actionsheet location */}
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: 30,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.scanButton}
          onPress={() => {
            props.navigation.navigate("Scan");
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "500", fontSize: 17 }}>
            Scan
          </Text>
        </TouchableOpacity>
      </View>
      {/* beautify modal */}
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
          // for bug which prevents dismiss from firing on swipe close
          // https://github.com/facebook/react-native/issues/26892
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
    backgroundColor: "#fff",
    flexDirection: "column",
    // alignItems: "center",
    // flexGrow: 1,
  },
  scanButton: {
    height: 50,
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
});

// export const IOSScreenOptions = (navData) => {
//   return {
//     headerLeft: () => (
//       <TouchableOpacity
//         onPress={() => {
//           props.navigation.navigate("Settings");
//         }}
//       >
//         <Image
//           source={{
//             uri:
//               DrugStore.profile.display_picture === " "
//                 ? headerImg
//                 : DrugStore.profile.display_picture,
//           }}
//           style={{
//             height: 35,
//             width: 35,
//             marginTop: 0,
//             borderRadius: 17.5,
//             borderWidth: 1,
//             borderColor: "#333",
//             // shadowRadius: 10,
//             // shadowOpacity: 0.75,
//           }}
//         />
//       </TouchableOpacity>
//     ),
//     headerRight: () => (
//       <TouchableOpacity
//         onPress={() => {
//           props.navigation.navigate("Cart");
//         }}
//       >
//         <IconBadge
//           MainElement={
//             <Image
//               source={require("../assets/bag.png")}
//               style={{ height: 25, width: 25, marginTop: 0 }}
//             />
//           }
//           BadgeElement={
//             <Text style={{ color: "#FFFFFF" }}> {DrugStore.count} </Text>
//           }
//           IconBadgeStyle={{
//             width: 10,
//             height: 20,
//             backgroundColor: "purple",
//             marginTop: 5,
//           }}
//           Hidden={DrugStore.count == 0}
//         />
//       </TouchableOpacity>
//     ),
//     headerLargeTitle: false,
//     headerTitle: "Aushadhalay",
//     headerTitleAlign: "center",
//   };
// };

// export const AndroidScreenOptions = (navData) => {
//   return {
//     headerRight: () => (
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           // justifyContent: "space-around",
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => {
//             navData.navigation.navigate("Settings");
//           }}
//         >
//           <Image
//             source={{
//               uri:
//                 DrugStore.profile.display_picture.length === 1
//                   ? "https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png"
//                   : DrugStore.profile.display_picture,
//             }}
//             style={{
//               height: 35,
//               width: 35,
//               marginTop: 0,
//               borderRadius: 17.5,
//               // shadowOpacity: 0.75,
//             }}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             navData.navigation.navigate("Cart");
//           }}
//         >
//           <IconBadge
//             MainElement={
//               <Image
//                 source={require("../assets/bag.png")}
//                 style={{ height: 25, width: 25, marginTop: 0 }}
//               />
//             }
//             BadgeElement={
//               <Text style={{ color: "#FFFFFF" }}> {DrugStore.count} </Text>
//             }
//             IconBadgeStyle={{
//               width: 10,
//               height: 20,
//               backgroundColor: "purple",
//               marginTop: 5,
//             }}
//             Hidden={DrugStore.count == 0}
//           />
//         </TouchableOpacity>
//       </View>
//     ),
//     headerLargeTitle: false,
//     headerTitle: "Aushadhalay",
//     // औषधालय,
//     // headerTitle: `Welcome back, \n ${DrugStore.userCredentials.email.substring(
//     //   0,
//     //   DrugStore.userCredentials.email.indexOf("@")
//     // )}`,
//     // headerTitleStyle: { textAlign: "center", flex: 1 },
//   };
// };

const connectedApp = connectActionSheet(HomeScreen);

export default connectedApp;

// {"coords": {"accuracy": 5, "altitude": 0, "altitudeAccuracy": -1, "heading": -1, "latitude": 37.785834, "longitude": -122.406417, "speed": -1}, "timestamp": 1605103023554.0972}
