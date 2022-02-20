(navigator as any).geolocation = require('react-native-geolocation-service');

import React, { useEffect } from 'react';
import { View, LogBox } from 'react-native';
import RootNavigation from './navigation/RootNavigation';
import { client } from './store/store';
import { ApolloProvider } from '@apollo/client';
import { observer } from 'mobx-react';
import FlashMessage from 'react-native-flash-message';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import RNBootSplash from 'react-native-bootsplash';

// Deprecation warnings in Expo Modules
LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  'new NativeEventEmitter()',
  'Overwriting fontFamily style attribute preprocessor',
]);

const App = observer(() => {
  useEffect(() => {
    const init = async () => {
      await RNBootSplash.show({ fade: true })
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
    });
  }, []);


  return (
    <ActionSheetProvider>
      <ApolloProvider client={client}>
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
          <RootNavigation />
          <FlashMessage position="bottom" />
        </View>
      </ApolloProvider>
    </ActionSheetProvider>
  );
});

export default App;
