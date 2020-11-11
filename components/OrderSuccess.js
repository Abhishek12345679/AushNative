import React from "react";
import { View, Text, Button } from "react-native";

const OrderSuccess = (props) => {
  return (
    <View>
      <Text>Success</Text>
      <Button title="continue shopping" onPress={props.onPress} />
    </View>
  );
};

export default OrderSuccess;
