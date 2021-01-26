import React from "react";
import { View, Text } from "react-native";
import OrderFailed from "../../components/OrderFailed";
import OrderSuccess from "../../components/OrderSuccess";

const OrderConfirmationStatus = (props) => {
  const status = props.route.params.status;
  console.log("status", status);
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      {status ? (
        <OrderSuccess
          url="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"
          onPress={() => props.navigation.navigate({ name: "Home" })}
        /> //popToTop()
      ) : (
        <OrderFailed
          url="https://media.giphy.com/media/xTiTnLbo0KIJ8hrNjG/giphy.gif"
          onPress={() => props.navigation.navigate({ name: "Home" })}
        />
      )}
    </View>
  );
};

export default OrderConfirmationStatus;
