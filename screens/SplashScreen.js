import React, { useEffect } from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";

import DrugStore from "../store/CartStore";
import { observer } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";

import * as Firebase from "firebase";

const SplashScreen = observer(({ navigation }) => {
  useEffect(() => {
    const retrieveUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("login_data");

        if (!jsonValue) {
          DrugStore.setDidTryAutoLogin();
          return;
        }

        const parsedData = JSON.parse(jsonValue);
        console.log(parsedData);

        const { token, uid, email } = parsedData;

        // handle Expiration ? //

        DrugStore.setDidTryAutoLogin();
        DrugStore.initializeUserCredentials(token, uid, email);

        // console.log("email", DrugStore.userCredentials.email);
      } catch (e) {
        console.log(e);
      }
    };

    retrieveUserData();
  }, [DrugStore]);

  useEffect(() => {
    console.log("SPLASHSCREEN");
  }, []);

  //login-logout buggy

  // useEffect(() => {
  //   const startTimer = () => {
  //     setTimeout(() => {
  //       Firebase.auth().onAuthStateChanged((user) => {
  //         if (user != null) {
  //           DrugStore.initializeUserCredentials("", "", "");
  //           AsyncStorage.removeItem("login_data");
  //         }
  //       });
  //       // DrugStore.initializeUserCredentials("", "", "");
  //       // AsyncStorage.removeItem("login_data");
  //     }, 10000);
  //   };
  //   startTimer();
  // }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image source={require("../assets/icon.png")} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SplashScreen;
