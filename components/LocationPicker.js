import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

const LocationPicker = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center",
      }}
    >
      <Text style={{ marginEnd: 10 }}>{props.location}</Text>
      <Ionicons name="ios-arrow-down" size={24} color="#000" />
    </TouchableOpacity>
  );
};

export default LocationPicker;
