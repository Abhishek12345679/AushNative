import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

import * as Firebase from "firebase";
import { firebaseConfig } from "../constants/config";

import { ModalPortal } from "react-native-modals";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator, ShopNavigator, TabNavigator } from "./AppNavigator";
import { AuthNavigator } from "./AppNavigator";
import DrugStore from "../store/CartStore";
import SplashScreen from "../screens/SplashScreen";
import SignUpScreen from "../screens/Authentication/SignUpScreen";

const AppContainer = observer((props) => {
  if (!Firebase.apps.length) {
    Firebase.initializeApp(firebaseConfig);
  }
  return (
    <NavigationContainer>
      {!!DrugStore.userCredentials.token.length > 0 && <TabNavigator />}
      {!!!DrugStore.userCredentials.token.length > 0 &&
        !!DrugStore.didTryAutoLogin && <AuthNavigator />}
      {(!!!DrugStore.userCredentials.token.length > 0 ||
        !!!DrugStore.userCredentials.token) &&
        !!!DrugStore.didTryAutoLogin && <SplashScreen />}
      {/* <SplashScreen /> */}
      {/* <AuthNavigator /> */}
      <ModalPortal />
    </NavigationContainer>
  );
});

export default AppContainer;
