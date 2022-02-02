import React from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";

import { observer } from "mobx-react";

const SplashScreen = observer(() => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={require("../assets/adaptive-icon.png")}
        style={{ height: 100, width: 100 }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SplashScreen;
