import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { AppearanceProvider } from "react-native-appearance";

import { ApolloProvider } from "@apollo/client";
import { client } from "./store/store";

import RootNavigation from "./navigation/RootNavigation";

import { observer } from "mobx-react";

import FlashMessage from "react-native-flash-message";

// require("dotenv").config();

const App = observer((props) => {
  return (
    <AppearanceProvider>
      <ApolloProvider client={client}>
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
          <RootNavigation />
          <FlashMessage position="bottom" />
        </View>
      </ApolloProvider>
    </AppearanceProvider>
  );
});

export default App;
