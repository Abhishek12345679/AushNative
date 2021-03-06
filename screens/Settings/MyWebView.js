import React, { useEffect } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const MyWebView = (props) => {
  const url = props.route.params.url;
  console.log("url", url);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: props.route.params.headerTitle,
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: url }} />
    </View>
  );
};

// class MyWebView extends Component {
//   render(props) {
//     const url = props.route.params.url;
//     console.log("url", url);
//     return (
//       <View style={{ flex: 1 }}>
//         <WebView source={{ uri: url }} style={{ marginTop: 20 }} />
//       </View>
//     );
//   }
// }

export default MyWebView;
