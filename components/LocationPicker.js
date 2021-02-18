import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { Platform } from "react-native";

const LocationPicker = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.PRIMARY,
        height: 45,
      }}
    >
      <Text
        style={{
          marginEnd: 10,
          marginStart: Platform.OS === "ios" ? 20 : 15,
          fontWeight: "500",
          fontSize: 16.5,
          color: "#fff",
        }}
      >
        {props.location.indexOf(",") === -1
          ? props.location
          : props.location.substring(0, props.location.indexOf(",", 2))}
      </Text>
      <Ionicons name="ios-arrow-down" size={20} color="#fff" />
    </TouchableOpacity>
  );
};

export default LocationPicker;
