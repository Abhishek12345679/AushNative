import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import { AntDesign } from "@expo/vector-icons";

const QuantitySelector = (props) => {
  // let [quantity, setQuantity] = useState("1");

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          value={props.quantity}
          editable={false}
        />
      </View>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          paddingVertical: 10,
        }}
      >
        <AntDesign
          name="plus"
          size={20}
          color="#fff"
          onPress={
            // setQuantity((initialValue + 1).toString());
            // setInitialValue(initialValue + 1);
            props.onIncrease
          }
        />
        <AntDesign
          name="minus"
          size={20}
          color="#fff"
          onPress={
            // if (initialValue >= 1) {
            //   setQuantity((initialValue - 1).toString());
            //   setInitialValue(initialValue - 1);
            // }
            props.onDecrease
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 0.5,
    // backgroundColor: "#e75468",
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    width: 80,
    borderRadius: 10,
    paddingHorizontal: 3,
  },
  input: {
    backgroundColor: "#fff",
    height: 65,
    width: 50,
    marginStart: 0,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    // color: "#fff",
    fontSize: 30,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});

export default QuantitySelector;
