import React, { useState, useEffect } from "react";
import { View } from "react-native";

import RootNavigation from "./navigation/RootNavigation";
import { client } from "./store/store";
import { ApolloProvider } from "@apollo/client";

import { observer } from "mobx-react";

import FlashMessage from "react-native-flash-message";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { MenuProvider } from "react-native-popup-menu";

import { StyleSheet } from "react-native";

const App = observer(() => {
  return (
    <MenuProvider
      style={styles.container}
      customStyles={{ backdrop: styles.backdrop }}
    >
      <ActionSheetProvider>
        <ApolloProvider client={client}>
          <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            <RootNavigation />
            <FlashMessage position="bottom" />
          </View>
        </ApolloProvider>
      </ActionSheetProvider>
    </MenuProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  backdrop: {
    backgroundColor: "#000",
  },
});

export default App;
