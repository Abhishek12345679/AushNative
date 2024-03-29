(navigator as any).geolocation = require('react-native-geolocation-service');

import React from 'react';
import { View, LogBox } from 'react-native';
import RootNavigation from './navigation/RootNavigation';
import { client } from './gqlclient_store';
import { ApolloProvider } from '@apollo/client';
import { observer } from 'mobx-react';
import FlashMessage from 'react-native-flash-message';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { colors } from './constants/colors';

// Deprecation warnings in Expo Modules
LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  'new NativeEventEmitter()',
  'Overwriting fontFamily style attribute preprocessor',
]);

const App = observer(() => {
  return (
    <ActionSheetProvider>
      <ApolloProvider client={client}>
        <View style={{ flex: 1, backgroundColor: colors.PRIMARY }}>
          <RootNavigation />
          <FlashMessage position="bottom" />
        </View>
      </ApolloProvider>
    </ActionSheetProvider>
  );
});

export default App;
