import React from "react";
import { observer } from "mobx-react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { AddressType } from "../store/CartStore";
import Tag from "./Tag";
interface AddressComponentProps {
  keyProp?: number | string;
  address: AddressType;
  onPress?: () => void;
  style?: {};
  addressLineTextStyle?: {};
  nameTextStyle?: {};
}

const Address = observer(({ keyProp, address, onPress, style, addressLineTextStyle, nameTextStyle }: AddressComponentProps) => {
  return (
    <Pressable
      key={keyProp}
      android_ripple={{
        color: "#fff",
        borderless: false
      }}
      onPress={onPress}
      style={{ ...styles.container, ...style }}
    >
      <View style={{ flexDirection: "row" }}>
        <Tag
          label="Type"
          value={address.type}
          bgc="#fff"
          textColor="#000" />
        <Tag
          label="Phone Number"
          value={address.ph_no}
          bgc="#fff"
          textColor="#000"
        />
      </View>
      <View style={{ margin: 5 }}>
        <Text
          style={
            {
              ...{
                color: "#FFF",
                fontSize: 20,
                fontWeight: "bold"
              },
              ...nameTextStyle
            }
          }
        >
          {address.name}
        </Text>
        <View style={{ flexDirection: "column", marginTop: 5 }}>
          <Text style={
            {
              ...{
                color: "#FFF",
                fontSize: 15,
                fontWeight: "normal"
              },
              ...addressLineTextStyle
            }
          }>{address.add_line_1}</Text>
          <Text style={
            {
              ...{
                color: "#FFF",
                fontSize: 15,
                fontWeight: "normal"
              },
              ...addressLineTextStyle
            }
          }>{address.add_line_2}</Text>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 175,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOpacity: 0.75,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 10,

    marginBottom: 10,
    padding: 15,
    shadowRadius: 10,

  },
});

export default Address;
