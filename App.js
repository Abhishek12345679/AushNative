import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { AppearanceProvider } from "react-native-appearance";

import RootNavigation from "./navigation/RootNavigation";
import { client } from "./store/store";
import { ApolloProvider } from "@apollo/client";

import { observer } from "mobx-react";

import FlashMessage from "react-native-flash-message";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const App = observer((props) => {
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

export default App;
