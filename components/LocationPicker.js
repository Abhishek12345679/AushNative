import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

const LocationPicker = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center",
        // marginTop: -5,
        backgroundColor: colors.PRIMARY,
      }}
    >
      <Text
        style={{
          marginEnd: 10,
          marginStart: 20,
          fontWeight: "500",
          fontSize: 15,
          color: "#fff",
        }}
      >
        {props.location.indexOf(",") === -1
          ? props.location
          : props.location.substring(0, props.location.indexOf(",", 2))}
      </Text>
      <Ionicons name="ios-arrow-down" size={22} color="#fff" />
    </TouchableOpacity>
  );
};

export default LocationPicker;
