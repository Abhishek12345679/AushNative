import { LinearGradient } from "expo-linear-gradient";
import { observer } from "mobx-react";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import DrugStore from "../store/CartStore";

const DP = observer((props) => {
  return (
    <LinearGradient
      colors={["purple", "red"]}
      style={{ ...styles.outer, ...props.outer }}
    >
      <Image
        style={{ ...styles.inner, ...props.inner }}
        source={{
          uri:
            DrugStore.profile.display_picture.length === 1
              ? "https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png"
              : DrugStore.profile.display_picture,
        }}
      />
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
  },
});

export default DP;
