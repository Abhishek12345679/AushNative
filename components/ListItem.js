import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { observer } from "mobx-react";
import DP from "./DP";

const ListItem = observer((props) => {
  return (
    <TouchableOpacity
      style={{ ...styles.listItem, ...props.style }}
      activeOpacity={0.75}
      onPress={props.onPress}
      key={props.keyProp}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={{ paddingLeft: 25, height: "100%" }}>
          <Text style={{ ...styles.textBig, ...props.titleStyle }}>
            {props.name}
          </Text>
          {props.salt_composition ? (
            <Text style={{ ...styles.textSmall, ...props.saltTextStyle }}>
              {props.salt_composition}
            </Text>
          ) : (
            <></>
          )}
        </View>
        {props.profile && <DP />}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    height: 80,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#ccc",
  },
  textBig: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  textSmall: {
    fontSize: 15,
    color: "purple",
    fontWeight: "500",
  },
});

export default ListItem;
