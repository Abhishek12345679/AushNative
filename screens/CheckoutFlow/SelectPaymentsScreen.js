import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

const SelectPaymentsScreen = (props) => {
  const address = props.route.params.address;
  console.log(address);

  const radioProps = [
    { label: "Cash on Delivery", value: 0 },
    { label: "Debit/Credit Card", value: 1 },
    { label: "Bitcoin", value: 2 },
    { label: "UPI", value: 3 },
  ];

  const [value, setValue] = useState(0);

  const onPress = (value) => {
    setValue(value);
    console.log(radioProps[value].label);
  };

  return (
    <View style={styles.container}>
      <Text>Select payment methods</Text>

      <RadioForm animation={true} formHorizontal={false}>
        {radioProps.map((obj, index) => (
          <RadioButton labelHorizontal={true} key={index}>
            <RadioButtonInput
              obj={obj}
              index={index}
              isSelected={value === index}
              onPress={onPress}
            />
            <RadioButtonLabel
              obj={obj}
              index={index}
              labelHorizontal={true}
              onPress={onPress}
              labelStyle={{ fontSize: 17, color: "#000" }}
            />
          </RadioButton>
        ))}
      </RadioForm>
      <TouchableOpacity
        style={{
          marginVertical: 20,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          marginBottom: 40,
        }}
        onPress={() =>
          props.navigation.navigate("OrderPreview", {
            address: address,
            paymentMode: radioProps[value].label,
          })
        }
      >
        <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500" }}>
          Pay
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export const screenOptions = () => {
  return {
    headerTitle: "Select Payment Method",
    // headerLargeTitle: true,
    // stackPresentation: "modal",
  };
};

export default SelectPaymentsScreen;
