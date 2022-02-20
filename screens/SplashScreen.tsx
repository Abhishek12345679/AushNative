import React from "react";
import { View, Image, StyleSheet, StatusBar, Text } from "react-native";

import { observer } from "mobx-react";
import { colors } from "../constants/colors";

const SplashScreen = observer(() => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={require("../assets/adaptive-icon.png")}
        style={{ height: 100, width: 100 }}
      />
      <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold' }}>Aushadhalay</Text>
      <Text style={{ color: "#fff", fontSize: 15, }}>Scan awayyy!</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.PRIMARY
  },
});

export default SplashScreen;
