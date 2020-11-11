import React from "react";
import { WebView } from "react-native-webview";

const MyWebView = (props) => {
  return <WebView source={{ uri: props.url }} style={{ marginTop: 20 }} />;
};

export default MyWebView;
