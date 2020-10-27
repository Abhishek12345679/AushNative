import React, { useEffect } from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";

import DrugStore from "../store/CartStore";
import { observer } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";

import * as Firebase from "firebase";

const SplashScreen = observer(({ navigation }) => {
  const requestNewAuthToken = async (refToken) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const response = await fetch(
      "https://securetoken.googleapis.com/v1/token?key=AIzaSyBI3PnHGbtsukz2gQ9c2TbBEpQ-UBTFjtU&grant_type=refresh_token&refresh_token=AG8BCnd08egw-pP6cAn0gudt8pJA5DRQsStIWRh_3H2AT8OxHiUC9yW1AqUyZG7aD_ovjjKxnqvMnfaY2hJ5xOWU2lEg36ekHhPLM5M5LRqjPmBHxoVwdNxI95mej_USAHU0GSYAU765uRCNH4pM1NOmxBymeFoBvGrD-puZ-Nmkk52kcXHGl-HRcFAdZD7dcxPRFcgvwqjncNZnp8nqFaNDWYvzhrLfWQ",
      {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: refToken,
        }),
      }
    );

    const resData = await response.json();
    console.log("IDTOKEN", resData.id_token);
    // DrugStore.updateAuthToken(resData.id_token);
    return resData.id_token;
  };

  useEffect(() => {
    const retrieveUserData = async () => {
      try {
        const loginJSONValue = await AsyncStorage.getItem("login_data");
        const autoLoginCreds = await AsyncStorage.getItem("auto_login_data");

        // if (autoLoginCreds) {
        //   const autoLoginData = JSON.parse(autoLoginCreds);
        //   console.log("AUTO LOGIN DATA \n", autoLoginData);
        //   requestNewAuthToken(autoLoginData.refToken).then((token) => {
        //     // DrugStore.updateAuthToken(token);
        //     DrugStore.initializeUserCredentials(token);
        //   });
        //   console.log("token", DrugStore.userCredentials);
        // }

        // if (loginJSONValue) {
        //   const loginData = JSON.parse(loginJSONValue);
        //   console.log("LOGIN DATA \n", loginData);
        //   const { email, uid, token } = loginData;
        //   console.log(loginData);
        //   DrugStore.setDidTryAutoLogin();
        //   DrugStore.initializeUserCredentials(token, uid, email);
        // }

        const autoLoginData = JSON.parse(autoLoginCreds);
        console.log("AUTO LOGIN DATA \n", autoLoginData);

        const loginData = JSON.parse(loginJSONValue);
        console.log("LOGIN DATA \n", loginData);
        const { email, uid, token } = loginData;

        requestNewAuthToken(autoLoginData.refToken).then((token) => {
          // DrugStore.updateAuthToken(token);
          DrugStore.initializeUserCredentials(token, uid, email);
        });
        DrugStore.setDidTryAutoLogin();

        // console.log("YO");
      } catch (e) {
        console.log(e);
      }
    };

    retrieveUserData();
  }, []);

  useEffect(() => {
    console.log("SPLASHSCREEN");
  }, []);

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
