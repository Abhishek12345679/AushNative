import { observer } from "mobx-react";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Tag from "./Tag";

const Address = observer((props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      key={props.keyProp}
      onPress={props.onPress}
      style={{ ...styles.container, ...props.style }}
    >
      <View>
        <View style={{ flexDirection: "row" }}>
          <Tag label={props.type} bgc="#000" textColor="#fff" />
          <Tag label={props.ph_no} bgc="#000" textColor="#fff" />
        </View>
        <View style={{ padding: 5 }}>
          <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>
            {props.name}
          </Text>
          <View style={{ flexDirection: "column", marginTop: 10 }}>
            <Text>{props.add_line_1}</Text>
            <Text>{props.add_line_2}</Text>
            {/* <Text> - {props.pincode}</Text> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: 150,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.75,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    marginBottom: 10,
    padding: 10,
    shadowRadius: 10,
  },
});

export default Address;
