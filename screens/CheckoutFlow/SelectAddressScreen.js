import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import Address from "../../components/Address";
import DrugStore from "../../store/CartStore";

import { ProgressSteps, ProgressStep } from "react-native-progress-steps";

const SelectAddressScreen = (props) => {
  const [selectedAddress, setSelectedAddress] = useState(0);
  const { navigation } = props;
  useEffect(() => {
    // console.log(selectedAddress);
    DrugStore.fetchAddresses();
  }, [navigation]);
  // console.log(DrugStore.addresses);

  const email = DrugStore.userCredentials.email;
  const name = DrugStore.profile.name;
  const contact = DrugStore.addresses[selectedAddress].ph_no;
  const ordername = DrugStore.drugs[0].name + "...";

  console.log({ email, name, contact, ordername });
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Select Address</Text>
        <Text>There are a few addresses available.</Text>
      </View> */}
      <View style={{ flex: 1 }}>
        <ProgressSteps stepCount={4} activeStep={0}>
          <ProgressStep label="Address" nextBtnText=""></ProgressStep>
          <ProgressStep label="Preview" nextBtnText=""></ProgressStep>
          <ProgressStep label="Prescription" nextBtnText=""></ProgressStep>
          <ProgressStep label="Payment" nextBtnText=""></ProgressStep>
        </ProgressSteps>
      </View>

      <FlatList
        keyExtractor={(item) => item.type}
        style={{ padding: 20 }}
        data={DrugStore.addresses}
        ListFooterComponent={
          <View>
            <TouchableOpacity
              style={{
                marginVertical: 20,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
                // marginBottom: 40,
              }}
              onPress={() => props.navigation.navigate("Add New Address")}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500" }}>
                Add New Address
              </Text>
            </TouchableOpacity>
            <TouchableHighlight
              style={{
                // marginVertical: 20,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
                marginBottom: 40,
              }}
              onPress={() =>
                // props.navigation.navigate("OrderPreview", {
                //   address: DrugStore.addresses[selectedAddress],
                //   paymentMode: "sample",
                // })
                props.navigation.navigate("UploadPrescription", {
                  address: selectedAddress,
                  paymentMode: "sample",
                })
              }
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500" }}>
                Deliver to this address
              </Text>
            </TouchableHighlight>
          </View>
        }
        renderItem={({ item, index }) => (
          <Address
            // selectMode
            onPress={() => {
              console.log(index);
              setSelectedAddress(index);
            }}
            style={{
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowRadius: 10,
              borderWidth: index === selectedAddress ? 2 : 0,
              borderColor: "blue",
            }}
            keyProp={item.ph_no}
            type={item.type}
            name={item.name}
            add_line_1={item.add_line_1}
            add_line_2={item.add_line_2}
            ph_no={item.ph_no}
            pincode={item.pincode}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    // padding: 20,
  },
});
export const screenOptions = (navData) => {
  return {
    headerTitle: "Addresses",
    headerLargeTitle: false,
    headerShown: true,
    headerRight: () => (
      <Text
        style={{ color: "rgb(36,61,138)", fontWeight: "500", fontSize: 17 }}
        onPress={() => {
          navData.navigation.pop();
        }}
      >
        cancel
      </Text>
    ),
  };
};

export default SelectAddressScreen;

// curl -u rzp_test_JTQ6Nksjcb9tRj:2fXQGvQKrEc9CuG9Xcvw1pOW
// -X GET https://api.razorpay.com/v1/orders/?expand[]=payments
