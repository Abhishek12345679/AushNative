import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import DrugStore from "../store/CartStore";
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
      {/* <Image source={{ uri: props.image_url }} style={styles.image} /> */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          // backgroundColor: "#000",
          width: "100%",
          // paddingHorizontal: 10,
        }}
      >
        <View style={{ paddingLeft: 25, height: "100%" }}>
          <Text style={{ ...styles.textBig, ...props.titleStyle }}>
            {props.name}
          </Text>
          <Text style={{ ...styles.textSmall, ...props.saltTextStyle }}>
            {props.salt_composition}
          </Text>
          {/* {props.age >= 0 && <Text>{props.age >= 18 ? "Adult" : "Minor"}</Text>} */}
        </View>
        {!props.noArrow && (
          <View style={{ marginEnd: 10 }}>
            <AntDesign name="right" size={20} color="#ccc" />
          </View>
        )}
        {props.profile && <DP />}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    width: "100%",
    height: 75,
    backgroundColor: "#fff",
    // marginVertical: 7.5,
    // borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
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
  // image: {
  //   height: 60,
  //   width: 60,
  //   marginStart: 10,
  //   borderRadius: 10,
  //   marginLeft: 0,
  // },
});

export default ListItem;
