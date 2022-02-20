import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import firebase from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firebaseConfig from '../constants/config';

import { ModalPortal } from 'react-native-modals';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator, AuthNavigator } from './AppNavigator';
import SplashScreen from '../screens/SplashScreen';
import DrugStore from '../store/CartStore';
import { colors } from '../constants/colors';

const AppContainer = observer(() => {
  const [initializing, setInitializing] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  useEffect(() => {
    setInitializing(true)
    const subscriber = auth()
      .onAuthStateChanged(async (user: FirebaseAuthTypes.User) => {
        if (user) {
          const token = await user.getIdToken(true);
          DrugStore.initializeUserCredentials(token, user.uid, user.email);
          setUser(user);
        } else {
          console.log("No User")
          setUser(null)
        }
      });
    setInitializing(false)
    return subscriber;
  }, []);

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: colors.PRIMARY,
          // add other theme stuff later?
        },
      }}>
      {initializing && <SplashScreen />}
      {!user && !initializing && <AuthNavigator />}
      {user && <MainNavigator />}
      <ModalPortal />
    </NavigationContainer>
  );
});

export default AppContainer;
