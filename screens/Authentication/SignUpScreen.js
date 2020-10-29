import { Formik } from "formik";
import { observer } from "mobx-react";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { Fumi } from "react-native-textinput-effects";

import DrugStore from "../../store/CartStore";

import * as Firebase from "firebase";

import AsyncStorage from "@react-native-community/async-storage";
import { showMessage } from "react-native-flash-message";

const SignUpScreen = observer(({ navigation }) => {
  // const setAuthState = (status) => {
  //   DrugStore.setAuthState(status);
  // };

  const [loading, setLoading] = useState(false);
  const [signIn, setSignIn] = useState(true);
  const signInRef = useRef();

  // function getUserData() {
  //   console.log(signInRef.current.values);
  // }

  const UTCtoMS = (utc) => {
    const timeInMS = utc.getTime() - new Date().getTime();
    console.log("in ms", timeInMS);
    return timeInMS;
  };

  // for storing the user data on login on device
  const saveUserOnDevice = async (token, uid, email) => {
    try {
      const jsonValue = JSON.stringify({
        token: token,
        uid: uid,
        email: email,
      });
      await AsyncStorage.setItem("login_data", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const saveUser = async (user) => {
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem("user_data", jsonValue);
    } catch (error) {
      console.log(error);
    }
  };

  const saveAutoLoginCredentials = async (refToken, expirationTime, apiKey) => {
    try {
      const jsonValue = JSON.stringify({ refToken, expirationTime, apiKey });
      await AsyncStorage.setItem("auto_login_data", jsonValue);
    } catch (error) {
      console.log(error);
    }
  };

  // create account
  const signup = async (name, email, password) => {
    console.log("USER", { name, email, password });
    try {
      setLoading(true);
      if (!password.length >= 6) {
        Alert.alert("Password invalid");
        return;
      }
      await Firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          if (user) {
            console.log("user exists");
            user.user.updateProfile({
              displayName: name,
              email: email,
            });
          }
        });
      showMessage({
        message: "Account created successfully",
        type: "success",
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      Alert.alert("Something went wrong");
      return;
    }
  };

  // Log in
  const login = async (email, password) => {
    try {
      setLoading(true);
      const loginRes = await Firebase.auth().signInWithEmailAndPassword(
        email,
        password
      );
      const token = await Firebase.auth().currentUser.getIdToken(true);

      const loginProps = await Firebase.auth().currentUser.getIdTokenResult(
        true
      );
      const refreshToken = Firebase.auth().currentUser.refreshToken;
      console.log("expTime", new Date(loginProps.expirationTime));
      saveAutoLoginCredentials(
        refreshToken,
        UTCtoMS(new Date(loginProps.expirationTime)),
        refreshToken
      );

      Firebase.auth().onAuthStateChanged((user) => {
        saveUser(user);
        // saveAutoLoginCredentials(user.)
        console.log("auto login creds saved ...");
      });

      saveUserOnDevice(token, loginRes.user.uid, email);

      DrugStore.initializeUserCredentials(token, loginRes.user.uid, email);
      // startTimer();
    } catch (error) {
      console.log(error);
      setLoading(false);
      return Alert.alert("Something Went Wrong");
    }
  };

  //login & logout buggy
  const startTimer = () => {
    setTimeout(() => {
      Firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          DrugStore.initializeUserCredentials("", "", "");
          AsyncStorage.removeItem("login_data");
        }
      });
      // DrugStore.initializeUserCredentials("", "", "");
      // AsyncStorage.removeItem("login_data");
    }, 3600 * 1000);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          // alignItems: "center",
          marginTop: 20,
          padding: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 40 }}>
          Welcome Back
          <Text style={{ color: "purple", fontWeight: "bold", fontSize: 45 }}>
            {"  "}Stranger
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
        activeOpacity={1}
        onPress={() => Keyboard.dismiss()}
      >
        <StatusBar barStyle="light-content" />
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
          }}
          // onSubmit={signIn ? () => signup() : () => login()}
          // onSubmit={getUserData}
          innerRef={signInRef}
        >
          {({ handleSubmit, handleChange, values }) => (
            <View>
              {/* <Fumi
                label={"Email"}
                iconClass={FontAwesomeIcon}
                iconName={"envelope"}
                iconColor={"#000"}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                onChangeText={handleChange("email")}
              />
              <Fumi
                secureTextEntry
                style={{ marginVertical: 10 }}
                label={"Password"}
                iconClass={FontAwesomeIcon}
                iconName={"key"}
                iconColor={"#000"}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                onChangeText={handleChange("password")}
              /> */}
              {signIn && (
                <TextInput
                  placeholder="Name"
                  style={styles.input}
                  onChangeText={handleChange("name")}
                  autoCapitalize="none"
                />
              )}
              <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={handleChange("email")}
                autoCapitalize="none"
              />
              <TextInput
                secureTextEntry
                placeholder="Password"
                style={styles.input}
                onChangeText={handleChange("password")}
                autoCapitalize="none"
              />
              {signIn && (
                <TouchableOpacity
                  disabled={
                    values.email.length < 10 && values.password.length < 6
                  }
                  onPress={() => {
                    signup(values.name, values.email, values.password);
                    // getUserData();
                  }}
                  style={{
                    backgroundColor: "skyblue",
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 25,
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}
                  >
                    Create Account
                  </Text>
                </TouchableOpacity>
              )}
              {!signIn && (
                <TouchableOpacity
                  disabled={
                    values.email.length < 10 && values.password.length < 6
                  }
                  onPress={() => {
                    login(values.email, values.password);
                  }}
                  style={{
                    backgroundColor: "purple",
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 25,
                  }}
                >
                  {!loading ? (
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      Login
                    </Text>
                  ) : (
                    <ActivityIndicator size="large" color="#fff" />
                  )}
                </TouchableOpacity>
              )}
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginVertical: 20,
                }}
              >
                {!signIn ? (
                  <Text style={{ color: "#fff" }}>
                    Create an account.{" "}
                    <Text
                      style={{ color: "purple", fontWeight: "bold" }}
                      onPress={() => setSignIn(true)}
                    >
                      Sign in
                    </Text>
                  </Text>
                ) : (
                  <Text style={{ color: "#fff" }}>
                    Already have an account.{" "}
                    <Text
                      style={{ color: "purple", fontWeight: "bold" }}
                      onPress={() => setSignIn(false)}
                    >
                      Login
                    </Text>
                  </Text>
                )}
              </View>
            </View>
          )}
        </Formik>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // justifyContent: "center",
    // alignItems: "center",
  },
  input: {
    height: 60,
    width: "100%",
    backgroundColor: "#FFF",
    marginVertical: 10,
    // borderRadius: 20,
    paddingLeft: 10,
    color: "#000",
    fontSize: 20,
    fontWeight: "500",
  },
});

export default SignUpScreen;
