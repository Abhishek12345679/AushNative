import { observer } from "mobx-react";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AddressType } from "../store/CartStore";
import Tag from "./Tag";


interface AddressComponentProps {
  keyProp?: number | string;
  address: AddressType;
  onPress?: () => void;
  style?: StyleSheet
}


const Address = observer(({ keyProp, address, onPress, style }: AddressComponentProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      key={keyProp}
      onPress={onPress}
      style={{ ...styles.container, ...style }}
    >
      <View>
        <View style={{ flexDirection: "row" }}>
          <Tag label={address.type} bgc="#000" textColor="#fff" />
          <Tag label={address.ph_no} bgc="#000" textColor="#fff" />
        </View>
        <View style={{ padding: 5 }}>
          <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>
            {address.name}
          </Text>
          <View style={{ flexDirection: "column", marginTop: 10 }}>
            <Text>{address.add_line_1}</Text>
            <Text>{address.add_line_2}</Text>
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
