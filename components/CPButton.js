import React from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Platform,
  // TouchableNativeFeedback,
} from "react-native";

const CPButton = (props) => {
  return (
    <>
      {props.iOS ? (
        <Button
          onPress={props.onpress}
          title={props.text}
          color={props.color}
        />
      ) : (
        <TouchableOpacity
          onPress={props.onpress}
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            // width: 100,
            // height: 100,
          }}
        >
          <Text style={{ color: "#fff" }}>{props.text}</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
  },
});

export default CPButton;
