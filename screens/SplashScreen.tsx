import React from "react";
import { View, StyleSheet, StatusBar, Text } from "react-native";

import { observer } from "mobx-react";
import { colors } from "../constants/colors";

const SplashScreen = observer(() => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={{ color: "#fff", fontSize: 100, fontWeight: 'bold' }}>
        A
        <Text style={{ color: "#fff", fontSize: 100, fontWeight: 'bold' }}>.</Text>
      </Text>
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
