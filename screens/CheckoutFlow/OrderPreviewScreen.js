import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { showMessage } from "react-native-flash-message";
import DrugStore from "../../store/CartStore";

const OrderPreviewScreen = (props) => {
  const address = props.route.params.address;
  const paymentMode = props.route.params.paymentMode;

  // console.log("address", address);
  // console.log("paymentmode", paymentMode);

  const { drugs } = DrugStore;
  let total_checkout_amt = 0;

  const [checkingOut, setCheckingOut] = useState(false);

  // console.log(drugs[1].quantity);

  for (let i = 0; i < drugs.length; i++) {
    total_checkout_amt = total_checkout_amt + drugs[i].total_amt;
  }

  return (
    <View>
      {DrugStore.drugs.map((drug, index) => (
        <View key={index}>
          <Text> {drug.name} </Text>
          <Text> {drug.salt} </Text>
        </View>
      ))}
      <Text> {address["type"]} </Text>
      <Text> {paymentMode} </Text>
      <Button
        title="buy"
        onPress={() => {
          // setCheckingOut(true);
          setTimeout(() => {
            // setCheckingOut(false);
            showMessage({
              message: `Order Successful`,
              type: "success",
              position: "top",
            });
          }, 3000);
          DrugStore.addOrder({
            items: DrugStore.drugs,
            datetimestamp: new Date().getTime(),
            address: address,
            total_amt: total_checkout_amt,
          });
          DrugStore.clearCart();
          // props.navigation.goToParent();
          props.navigation.navigate({ name: "Home" });
          props.navigation.pop();
        }}
      />
    </View>
  );
};

export default OrderPreviewScreen;
