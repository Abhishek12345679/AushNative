import React, { useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const MyWebView = (props: any) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: props.route.params.headerTitle,
    });
  }, []);

  return (
    <View style={{ flex: 1, marginTop: -330 }}>
      <WebView source={{ uri: props.route.params.url }} />
    </View>
  );
};

export default MyWebView;
