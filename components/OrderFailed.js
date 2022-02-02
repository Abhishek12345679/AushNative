import React from "react";
import { View, Text, Button, Image } from "react-native";

const OrderFailed = (props) => {
  return (
    <View>
      <Image source={{ uri: props.url }} style={{ height: 400, width: 400 }} />
      <Button title="continue shopping" onPress={props.onPress} />
    </View>
  );
};

export default OrderFailed;
