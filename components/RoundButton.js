import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RoundButton = (props) => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={{ ...styles.button, ...props.style }}
    >
      {props.children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // flex: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RoundButton;
