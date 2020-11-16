import React, { useEffect } from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";

import DrugStore from "../store/CartStore";
import { observer } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";

const SplashScreen = observer(({ navigation }) => {
  const requestNewAuthToken = async (refToken) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=AIzaSyBI3PnHGbtsukz2gQ9c2TbBEpQ-UBTFjtU&grant_type=refresh_token&refresh_token=${refToken}`,
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
    console.log("new auth data", resData);
    // DrugStore.updateAuthToken(resData.id_token);
    return resData;
  };

  const updateAutoLoginData = (expTime) => {
    AsyncStorage.getItem("auto_login_data")
      .then((data) => {
        // transform it back to an object
        if (data) {
          data = JSON.parse(data);
          console.log(data);
        }

        // Decrement
        data.expirationTime = expTime * 1000;
        console.log("updated exp Time", data);

        //save the value to AsyncStorage again
        AsyncStorage.setItem("auto_login_data", JSON.stringify(data));
      })
      .done();
  };

  useEffect(() => {
    const retrieveUserData = async () => {
      try {
        const loginJSONValue = await AsyncStorage.getItem("login_data");
        const autoLoginCreds = await AsyncStorage.getItem("auto_login_data");

        if (!loginJSONValue || !autoLoginCreds) {
          DrugStore.setDidTryAutoLogin();
        }

        const autoLoginData = JSON.parse(autoLoginCreds);
        console.log("AUTO LOGIN DATA \n", autoLoginData);

        const loginData = JSON.parse(loginJSONValue);
        console.log("LOGIN DATA \n", loginData);

        const { email, uid } = loginData;

        requestNewAuthToken(autoLoginData.refToken).then((data) => {
          // DrugStore.updateAuthToken(token);
          DrugStore.setDidTryAutoLogin();
          DrugStore.initializeUserCredentials(data.id_token, uid, email);
          updateAutoLoginData(autoLoginData.expirationTime);
        });

        // const timer = setInterval(() => {
        //   requestNewAuthToken(refreshToken).then((data) => {
        //     DrugStore.initializeUserCredentials(data.id_token, uid, email);
        //     updateAutoLoginData(data.expires_in);
        //   });
        //   // DrugStore.startTimer(timer);

        //   console.log("called requestNewToken");
        //   console.log("expires in ", autoLoginData.expirationTime);
        // }, autoLoginData.expirationTime);

        // DrugStore.clearTimer();
        // DrugStore.startTimer(timer);

        // console.log("YO")
      } catch (e) {
        console.log(e);
      }
    };

    retrieveUserData();
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
