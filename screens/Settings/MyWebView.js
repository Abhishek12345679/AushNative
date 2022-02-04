import React, { useEffect } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const MyWebView = (props) => {
  const url = props.route.params.url;

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: props.route.params.headerTitle,
    });
  }, []);

  return (
    <View style={{ flex: 1, marginTop: -330 }}>
      <WebView source={{ uri: url }} />
    </View>
  );
};

export default MyWebView;
