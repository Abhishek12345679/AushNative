import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { AppearanceProvider } from "react-native-appearance";

import { ApolloProvider } from "@apollo/client";
import { client } from "./store/store";

import RootNavigation from "./navigation/RootNavigation";

import { observer, Provider } from "mobx-react";

import FlashMessage from "react-native-flash-message";

const App = observer((props) => {
  return (
    // <AppearanceProvider>
    // <Provider store={}>
    <ApolloProvider client={client}>
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <RootNavigation />
        <FlashMessage position="bottom" />
      </View>
    </ApolloProvider>
    // </Provider>
    // </AppearanceProvider>
  );
});

export default App;
