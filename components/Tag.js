import React from "react";
import { View, Text } from "react-native";
import RoundButton from "./RoundButton";

const Tag = (props) => {
  return (
    <View
      style={{
        backgroundColor: props.bgc,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        borderRadius: 20,
        marginEnd: 5,
        width: 120,
        height: 35,
        marginBottom: 10,
      }}
    >
      {props.value && (
        <RoundButton style={{ width: 25, height: 25, marginEnd: 5 }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {props.value}
          </Text>
        </RoundButton>
      )}
      <Text style={{ fontWeight: "500", color: props.textColor }}>
        {props.label}
      </Text>
    </View>
  );
};

export default Tag;
