import React from "react";
import { Text, Button, TouchableOpacity } from "react-native";

const CameraPreviewCornerButton = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onpress}
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
        width: 100,
        height: 50,
      }}
    >
      <Text style={{ color: "#fff" }}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default CameraPreviewCornerButton;
