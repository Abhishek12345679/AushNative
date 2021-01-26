import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import SegmentedControl from "@react-native-community/segmented-control";

const ManualSearchBox = (props) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Search</Text>
      <Text style={{ marginTop: 10 }}>
        We Regret the inconvinience but it seems like our State of the art image
        recognition system is experiencing some issues. Please search for the
        Drug (via name or salt) Manually.
      </Text>
      <View style={{ justifyContent: "space-around", marginTop: 25 }}>
        <SegmentedControl
          values={["Name", "Salt"]}
          selectedIndex={props.selectedIndex}
          onChange={props.onchange}
          appearance="light"
        />

        {/* the text of the value is weird "Bug" on android */}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            placeholder={
              props.selectedIndex === 0 ? "...medicine..." : "...Salt..."
            }
            placeholderTextColor="#aaa"
            value={props.value}
            style={styles.input}
            onChangeText={props.onchangeText}
          />
        </View>
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <TouchableOpacity
          disabled={!props.value && props.value.length < 4}
          style={styles.searchBtn}
          activeOpacity={0.75}
          onPress={props.onpress}
        >
          <Text style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: "100%",
    borderColor: "#9400D3",
    color: "#000",
    borderWidth: 2,
    marginBottom: 10,
    height: 50,
    borderRadius: 5,
    fontSize: 15,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  searchBtn: {
    width: "100%",
    height: 60,
    backgroundColor: "#9400D3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});

export default ManualSearchBox;
