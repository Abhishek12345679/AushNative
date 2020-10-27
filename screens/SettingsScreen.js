import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import DrugStore from "../store/CartStore";

import { observer } from "mobx-react";

import * as Firebase from "firebase";
import ListItem from "../components/ListItem";

const SettingsScreen = observer((props) => {
  const [date, setDate] = useState();
  const age = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24 * 365));

  const UTCToIST = () => {
    const offset = new Date().getTimezoneOffset();
    // console.log(offset);
    const newDate = DrugStore.profile.dob;
    newDate.setMinutes(newDate.getMinutes() - offset);
    // console.log(newDate);
    setDate(newDate);
  };

  useEffect(() => {
    UTCToIST();
  }, [UTCToIST]);
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
        {["Profile", "Addresses", "Orders", "Health Conditions"].map(
          (item, index) => (
            <ListItem
              style={{ height: 70 }}
              titleStyle={{ fontWeight: "400", fontSize: 18 }}
              keyProp={Math.random() * 10}
              key={Math.random() * 10}
              name={item}
              onPress={() => props.navigation.navigate(item)}
            />
          )
        )}
      </View>
      <ListItem
        name="Log Out"
        onPress={() =>
          Alert.alert(
            "Log out",
            "This will make you re-enter your password",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "normal",
              },
              {
                text: "Log out",
                onPress: async () => {
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
                  } catch (e) {
                    console.log(e);
                  }
                },
                style: "destructive",
              },
            ],
            { cancelable: false }
          )
        }
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

export default SettingsScreen;
