import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import Address from "../../components/Address";
import DrugStore from "../../store/CartStore";

import RazorpayCheckout from "react-native-razorpay";
import { ActivityIndicator } from "react-native-paper";

const OrderPreviewScreen = (props) => {
  const address = props.route.params.address;
  const paymentMode = props.route.params.paymentMode;

  // console.log("address", address);
  // console.log("paymentmode", paymentMode);

  const { drugs } = DrugStore;
  let total_checkout_amt = 0;

  const [checkingOut, setCheckingOut] = useState(false);
  const [orderStatus, setOrderStatus] = useState(false);

  // useEffect(() => {
  //   props.navigation.navigate("OrderConfirmation", {
  //     status: orderStatus,
  //   });
  // }, [orderStatus]);

  const email = DrugStore.userCredentials.email;
  const name = DrugStore.profile.name;
  const contact = address.ph_no;
  const ordername = DrugStore.drugs[0].name + "...";

  // console.log(drugs[1].quantity);

  for (let i = 0; i < drugs.length; i++) {
    total_checkout_amt = total_checkout_amt + drugs[i].total_amt;
  }

  const toISTString = (unixtime) => {
    const dateObject = new Date(unixtime);
    const humanDateFormat = dateObject.toString();
    // return humanDateFormat.substring(0, humanDateFormat.indexOf("G"));
    return humanDateFormat.substring(0, humanDateFormat.indexOf(":") - 3);
  };

  const createOrder = async () => {
    const response = await fetch(
      "https://razorpay-payments-api.herokuapp.com/orders"
    );
    const resData = await response.json();

    console.log(resData);
    return resData.id;
  };

  const verifySignature = async (order_id, pid, signature) => {
    console.log({ order_id, pid, signature });
    const response = await fetch(
      "https://razorpay-payments-api.herokuapp.com/verifysignature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: order_id,
          razor_pid: pid,
          signature: signature,
        }),
      }
    );
    const resData = await response.json();
    console.log(resData);
    return resData;
  };

  return (
    // <View>
    //   {DrugStore.drugs.map((drug, index) => (
    //     <View key={index}>
    //       <Text> {drug.name} </Text>
    //       <Text> {drug.salt} </Text>
    //     </View>
    //   ))}
    //   <Text> {address["type"]} </Text>
    //   <Text> {paymentMode} </Text>
    //   <Button
    //     title="buy"
    //     onPress={() => {
    //       // setCheckingOut(true);
    //       setTimeout(() => {
    //         // setCheckingOut(false);
    //         showMessage({
    //           message: `Order Successful`,
    //           type: "success",
    //           position: "top",
    //         });
    //       }, 3000);
    //       DrugStore.addOrder({
    //         items: DrugStore.drugs,
    //         datetimestamp: new Date().getTime(),
    //         address: address,
    //         total_amt: total_checkout_amt,
    //       });
    //       DrugStore.clearCart();
    //       // props.navigation.goToParent();
    //       props.navigation.navigate({ name: "Home" });
    //       props.navigation.pop();
    //     }}
    //   />
    // </View>
    <ScrollView style={styles.container}>
      <View style={styles.item}>
        <View style={styles.textCont}>
          <Text style={styles.BoldText}>Order Date</Text>
          <Text>{toISTString(new Date())}</Text>
        </View>
        <View style={styles.textCont}>
          <Text style={styles.BoldText}>Order #</Text>

          <Text>{"sample"}</Text>
        </View>
        <View style={styles.textCont}>
          <Text style={styles.BoldText}>Order Total</Text>
          <Text style={{ color: "green", fontWeight: "bold" }}>
            ₹{total_checkout_amt}
          </Text>
        </View>
      </View>

      <Text style={{ padding: 25, fontSize: 30, fontWeight: "bold" }}>
        Items
      </Text>
      <View style={{ padding: 0 }}>
        {drugs.map((item, index) => (
          <View
            style={{
              ...styles.item,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            key={index}
          >
            <Image source={require("../../assets/medicine.png")} />
            <View>
              <Text style={{ ...styles.BoldText, width: 150 }}>
                {item.name}
              </Text>
              <Text>{item.salt}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginTop: 10,
                }}
              >
                {/* <Text style={{ marginHorizontal: 10, fontSize: 20 }}>
                      {drug.quantity}
                    </Text> */}
                <Text style={{ color: "green" }}>₹ {item.price}</Text>
                <Text> x {item.quantity} = </Text>
                <Text style={{ color: "green", fontWeight: "bold" }}>
                  ₹{item.total_amt.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <Text style={{ padding: 25, fontSize: 30, fontWeight: "bold" }}>
        Address
      </Text>
      <View style={{ paddingHorizontal: 20, alignItems: "center" }}>
        <Address
          type={address.type}
          name={address.name}
          ph_no={address.ph_no}
          add_line_1={address.add_line_1}
          add_line_2={address.add_line_2}
        />
        <TouchableOpacity
          style={{
            marginVertical: 20,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            marginBottom: 40,
            width: "100%",
          }}
          onPress={() => {
            setCheckingOut(true);
            createOrder().then((id) => {
              console.log("id", id);
              const options = {
                description:
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere laudantium pariatur quas officia corporis?", //product description
                image: "https://i.imgur.com/3g7nmJC.png", // product image
                currency: "INR",
                key: "rzp_test_JTQ6Nksjcb9tRj",
                amount: "5000",
                name: ordername,
                order_id: id, // order_id recieved after
                prefill: {
                  email: email,
                  contact: contact,
                  name: name,
                  method: "card", //default payment method
                },
                theme: { color: "#000" },
              };
              RazorpayCheckout.open(options)
                .then((data) => {
                  // handle success
                  setCheckingOut(false);
                  console.log("Success:", data);
                  verifySignature(
                    id,
                    data.razorpay_payment_id,
                    data.razorpay_signature
                  ).then((data) => {
                    if (data) {
                      props.navigation.navigate("OrderConfirmation", {
                        status: data.status,
                      });
                      // remove cartItems
                      if (data.status === true) {
                        DrugStore.clearCart();
                      }
                    }
                  });
                })
                .catch((error) => {
                  // handle failure
                  console.log(`Error: ${error.code} | ${error.description}`);
                });
            });
          }}
        >
          {!checkingOut ? (
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
              Pay
            </Text>
          ) : (
            <ActivityIndicator size="small" color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    // flex: 1,
    marginBottom: 40,
  },
  item: {
    marginHorizontal: 25,
    marginVertical: 10,
    borderWidth: 1,
    padding: 25,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  textCont: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  BoldText: {
    fontSize: 15,
    fontWeight: "bold",
    width: 100,
    marginEnd: 5,
  },
});

export default OrderPreviewScreen;
