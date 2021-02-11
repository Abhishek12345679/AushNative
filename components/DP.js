import { LinearGradient } from "expo-linear-gradient";
import { observer } from "mobx-react";
import React from "react";
import { ActivityIndicator } from "react-native";
import { View, Text, Image, StyleSheet } from "react-native";
import DrugStore from "../store/CartStore";

// import { Image } from "react-native-elements";

const DP = observer((props) => {
  return (
    <LinearGradient
      colors={["purple", "red"]}
      style={{ ...styles.outer, ...props.outer }}
    >
      {!props.loading ? (
        <Image
          style={{ ...styles.inner, ...props.inner }}
          source={{
            uri: props.editMode
              ? props.profile_picture
              : DrugStore.profile.display_picture,
          }}
        />
      ) : (
        <View style={{ ...styles.inner, ...props.inner }}>
          <ActivityIndicator size={24} color="#000" />
        </View>
      )}
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  outer: {
    width: 85,
    height: 85,
    borderRadius: 85 / 2.0,
    justifyContent: "center",
    alignItems: "center",
    marginEnd: 20,
  },
  inner: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2.0,
    backgroundColor: "#CCC",
    // borderWidth: 1,
    // borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DP;
