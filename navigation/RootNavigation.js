import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firebaseConfig from '../constants/config';

import {ModalPortal} from 'react-native-modals';
import {NavigationContainer} from '@react-navigation/native';
import {MainNavigator, AuthNavigator} from './AppNavigator';
import SplashScreen from '../screens/SplashScreen';
import DrugStore from '../store/CartStore';
import {colors} from '../constants/colors';

const AppContainer = observer(() => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  if (!firebase.apps.length) {
    //If a firebase app has not been initialized this will initialize it
    firebase.initializeApp(firebaseConfig);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async user => {
      // console.log(user);
      const token = await user.getIdToken(true);
      setUser(user);

      DrugStore.initializeUserCredentials(token, user.uid, user.email);
    });

    if (initializing) setInitializing(false);
    return subscriber;
  }, []);

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: colors.PRIMARY,
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
