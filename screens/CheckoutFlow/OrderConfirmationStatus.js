import React from "react";
import { View, Text } from "react-native";
import OrderFailed from "../../components/OrderFailed";
import OrderSuccess from "../../components/OrderSuccess";

const OrderConfirmationStatus = (props) => {
  const status = props.status;
  //   console.log(status);
  return (
    <View>
      {!status ? (
        <OrderSuccess
          onPress={() => props.navigation.navigate({ name: "Home" })}
        /> //popToTop()
      ) : (
        <OrderFailed
          onPress={() => props.navigation.navigate({ name: "Home" })}
        />
      )}
    </View>
  );
};

export default OrderConfirmationStatus;
