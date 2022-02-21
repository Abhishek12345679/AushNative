import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import firebase from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firebaseConfig from '../constants/config';

import { ModalPortal } from 'react-native-modals';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator, AuthNavigator } from './AppNavigator';
import DrugStore from '../store/CartStore';
import { colors } from '../constants/colors';
import * as BootSplash from 'react-native-bootsplash';
import SplashScreen from '../screens/SplashScreen';


const fakeApiCallWithoutBadNetwork = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const AppContainer = observer(() => {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const init = async () => {
    try {
      await fakeApiCallWithoutBadNetwork(1000);
      await BootSplash.hide();
      setInitializing(false)
    } catch (err) {
      console.error(err)
      setInitializing(false)
    }
  };

  useEffect(() => {
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
    return subscriber;
  }, []);

  useEffect(() => {
    initializing && init()
  }, [initializing]);

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: colors.PRIMARY,
        },
      }}>
      {/* {initializing && <SplashScreen />} */}
      {!user && !initializing && <AuthNavigator />}
      {user && !initializing && <MainNavigator />}
      <ModalPortal />
    </NavigationContainer>
  );
});

export default AppContainer;
