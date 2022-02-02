import React from "react";
import { observer } from "mobx-react";

import firebase from "@react-native-firebase/app";
import { firebaseConfig } from "../constants/config";

import { ModalPortal } from "react-native-modals";
import { NavigationContainer } from "@react-navigation/native";
import { TabNavigator } from "./AppNavigator";
import { AuthNavigator } from "./AppNavigator";
import DrugStore from "../store/CartStore";
import SplashScreen from "../screens/SplashScreen";

const AppContainer = observer(() => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  if (!firebase.apps.length) {
    /**
     * If a firebase app has not been initialized this will initialize it
     */
    firebase.initializeApp(firebaseConfig);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return <SplashScreen />;
  }

  if (!user) {
    return <AuthNavigator />;
  }

  return (
    <NavigationContainer>
      {/* {!!DrugStore.userCredentials.token.length > 0 && <TabNavigator />}
      {!!!DrugStore.userCredentials.token.length > 0 &&
        !!DrugStore.didTryAutoLogin && <AuthNavigator />}
      {(!!!DrugStore.userCredentials.token.length > 0 ||
        !!!DrugStore.userCredentials.token) &&
        !!!DrugStore.didTryAutoLogin && <SplashScreen />} */}
      <TabNavigator />
      <ModalPortal />
    </NavigationContainer>
  );
});

export default AppContainer;
