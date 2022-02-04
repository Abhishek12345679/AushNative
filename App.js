import React, { useEffect } from "react";
import { View } from "react-native";

import RootNavigation from "./navigation/RootNavigation";
import { client } from "./store/store";
import { ApolloProvider } from "@apollo/client";

import { observer } from "mobx-react";

import FlashMessage from "react-native-flash-message";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { StyleSheet } from "react-native";

import RNBootSplash from "react-native-bootsplash";

const App = observer(() => {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
      console.log("Bootsplash has been hidden successfully");
    });
  }, []);
  return (
    <ActionSheetProvider>
      <ApolloProvider client={client}>
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
          <RootNavigation />
          <FlashMessage position="bottom" />
        </View>
      </ApolloProvider>
    </ActionSheetProvider>
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
