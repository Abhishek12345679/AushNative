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

import { Ionicons } from "@expo/vector-icons";

// import RazorpayCheckout from "react-native-razorpay";

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

  // const createOrder = async () => {
  //   const response = await fetch(
  //     "https://razorpay-payments-api.herokuapp.com/orders"
  //   );
  //   const resData = await response.json();

  //   console.log(resData);
  //   return resData.id;
  // };

  // const verifySignature = async (order_id, pid, signature) => {
  //   console.log({ order_id, pid, signature });
  //   const response = await fetch(
  //     "https://razorpay-payments-api.herokuapp.com/verifysignature",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         order_id: order_id,
  //         razor_pid: pid,
  //         signature: signature,
  //       }),
  //     }
  //   );
  //   const resData = await response.json();
  //   console.log(resData);
  // };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Select Address</Text>
        <Text>There are a few addresses available.</Text>
      </View> */}

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
              onPress={
                () =>
                  props.navigation.navigate("OrderPreview", {
                    address: DrugStore.addresses[selectedAddress],
                    paymentMode: "sample",
                  })
                // createOrder().then((id) => {
                //   console.log("id", id);
                //   const options = {
                //     description:
                //       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere laudantium pariatur quas officia corporis?", //product description
                //     image: "https://i.imgur.com/3g7nmJC.png", // product image
                //     currency: "INR",
                //     key: "rzp_test_JTQ6Nksjcb9tRj",
                //     amount: "5000",
                //     name: ordername,
                //     order_id: id, // order_id recieved after
                //     prefill: {
                //       email: email,
                //       contact: contact,
                //       name: name,
                //       method: "card", //default payment method
                //     },
                //     theme: { color: "#000" },
                //   };
                //   RazorpayCheckout.open(options)
                //     .then((data) => {
                //       // handle success
                //       console.log("Success:", data);
                //       verifySignature(
                //         id,
                //         data.razorpay_payment_id,
                //         data.razorpay_signature
                //       );
                //     })
                //     .catch((error) => {
                //       // handle failure
                //       console.log(
                //         `Error: ${error.code} | ${error.description}`
                //       );
                //     });
                // })
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
    headerTitle: "Select your Address",
    headerLargeTitle: false,
    // stackPresentation: "modal",

    headerShown: true,
    // headerLeft: () => (
    //   <TouchableOpacity
    //     onPress={() => navData.navigation.navigate("Add New Address")}
    //   >
    //     <Ionicons name="ios-add-circle-outline" size={24} color="blue" />
    //   </TouchableOpacity>
    // ),
  };
};

export default SelectAddressScreen;

// curl -u rzp_test_JTQ6Nksjcb9tRj:2fXQGvQKrEc9CuG9Xcvw1pOW
// -X GET https://api.razorpay.com/v1/orders/?expand[]=payments
