import React from "react";
import { View, Text, Button } from "react-native";

const OrderFailed = (props) => {
  return (
    <View>
      <Text>Failed</Text>
      <Button title="continue shopping" onPress={props.onPress} />
    </View>
  );
};

export default OrderFailed;
