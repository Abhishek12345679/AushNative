import React, { useEffect } from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";

import DrugStore from "../store/CartStore";
import { observer } from "mobx-react";
import AsyncStorage from "@react-native-community/async-storage";
import * as Firebase from "firebase";

import { requestNewAuthToken } from "../helpers/requestNewAuthToken";

const SplashScreen = observer(({ navigation }) => {
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

        Firebase.auth().onAuthStateChanged((user) => {
          console.log(user);
          DrugStore.setPFP(user.photoURL);
        });
      } catch (e) {
        console.log(e);
      }
    };

    retrieveUserData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={require("../assets/adaptive-icon.png")}
        style={{ height: 100, width: 100 }}
      />
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
