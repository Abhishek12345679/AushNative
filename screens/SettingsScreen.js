import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Image } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import DrugStore from "../store/CartStore";

import { observer } from "mobx-react";

import * as Firebase from "firebase";
import ListItem from "../components/ListItem";

import { connectActionSheet } from "@expo/react-native-action-sheet";

const SettingsScreen = observer((props) => {
  const { navigation, showActionSheetWithOptions } = props;
  const [date, setDate] = useState();
  const age = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24 * 365));

  // const [headerImg, setHeaderImg] = useState(
  //   "https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png"
  // );

  const uid = DrugStore.userCredentials.uid;

  const UTCToIST = () => {
    const offset = new Date().getTimezoneOffset();
    // console.log(offset);
    const newDate = DrugStore.profile.dob;
    newDate.setMinutes(newDate.getMinutes() - offset);
    // console.log(newDate);
    setDate(newDate);
  };

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

  useEffect(() => {
    UTCToIST();
    console.log(DrugStore.profile.display_picture);
  }, [UTCToIST]);

  useEffect(() => {
    getDP().then((data) => {
      console.log(data);
      if (data.total_count !== 0) {
        // setHeaderImg(data.resources[0].url);
        DrugStore.setPFP(data.resources[0].url);
      }
    });
  }, [navigation]);

  const onOpenActionSheet = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ["Log Out", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        // Do something here depending on the button index selected
        if (buttonIndex === 0) {
          const logout = async () => {
            try {
              await Firebase.auth().signOut();
              console.log(
                `${DrugStore.userCredentials.uid} logged out successfully`
              );
              await AsyncStorage.removeItem("login_data");
              await AsyncStorage.removeItem("auto_login_data");
              await AsyncStorage.removeItem("user_data");
              DrugStore.initializeUserCredentials("", "", "");
              DrugStore.setPFP(" ");
              DrugStore.clearTimer();
            } catch (e) {
              console.log(e);
            }
          };
          logout();
        }
      }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ListItem
        name={
          DrugStore.profile.name.length < 3
            ? DrugStore.userCredentials.email.substr(
                0,
                DrugStore.userCredentials.email.indexOf("@")
              )
            : DrugStore.profile.name
        }
        salt_composition={DrugStore.userCredentials.email}
        style={{
          marginBottom: 30,
          borderRadius: 10,
          height: 100,
        }}
        titleStyle={{ fontWeight: "bold", fontSize: 20 }}
        noArrow
        profile
        age={age}
        onPress={() => {
          props.navigation.navigate("EditProfile", {
            screen: "Edit Profile",
            params: {
              dob: age,
              name: DrugStore.userCredentials.email.substr(
                0,
                DrugStore.userCredentials.email.indexOf("@")
              ),
            },
          });
        }}
      />
      <View
        style={{
          borderRadius: 12,
          width: "100%",
          overflow: "hidden",
        }}
      >
        {[
          // "Profile",
          "Addresses",
          "Orders",
          "Health Conditions",
        ].map((item, index) => (
          <ListItem
            style={{ height: 70 }}
            titleStyle={{ fontWeight: "400", fontSize: 18 }}
            keyProp={Math.random() * 10}
            key={Math.random() * 10}
            name={index == 0 ? "Saved Data" : item}
            onPress={() => props.navigation.navigate(item)}
          />
        ))}
      </View>

      <View
        style={{
          borderRadius: 12,
          width: "100%",
          overflow: "hidden",
          marginTop: 20,
        }}
      >
        {["Privacy Policy", "Terms and Conditions"].map((item, index) => (
          <ListItem
            style={{ height: 70 }}
            titleStyle={{ fontWeight: "400", fontSize: 18 }}
            keyProp={Math.random() * 10}
            key={Math.random() * 10}
            name={item}
            onPress={() => {
              props.navigation.navigate("MyWebView", {
                url:
                  index === 0
                    ? "https://aushadhalay.flycricket.io/privacy.html"
                    : "https://aushadhalay.flycricket.io/terms.html",
              });
            }}
          />
        ))}
      </View>
      <ListItem
        name="Log Out"
        onPress={onOpenActionSheet}
        style={{
          marginVertical: 30,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          height: 60,
          paddingTop: 10,
        }}
        titleStyle={{ fontWeight: "400", fontSize: 18, color: "red" }}
        noArrow
      />
      {/* <Image
        source={{
          uri: DrugStore.profile.display_picture,
        }}
        style={{ height: 100, width: 100 }}
      /> */}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e3e8",
    padding: 20,
  },
  input: {
    width: "100%",
    borderColor: "black",
    borderBottomWidth: 2,
    marginBottom: 10,
    height: 30,
    borderRadius: 10,
    color: "#9400D3",
    fontSize: 15,
    textAlign: "left",
    textAlignVertical: "bottom",
    paddingHorizontal: 10,
  },
  searchBtn: {
    width: "100%",
    height: 60,
    backgroundColor: "#9400D3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});

const connectedApp = connectActionSheet(SettingsScreen);

export default connectedApp;
