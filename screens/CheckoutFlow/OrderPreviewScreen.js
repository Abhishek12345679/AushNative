/* TODO: Razorpaycheckout.open gives an error (Error: TypeError: null is not an object (evaluating '_reactNative.NativeModules.RNRazorpayCheckout.open')) [ANDROID] */
// Works fine on iOS

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import Address from "../../components/Address";
import DrugStore from "../../store/CartStore";

import RazorpayCheckout from "react-native-razorpay";
import { ActivityIndicator } from "react-native-paper";

import { ProgressSteps, ProgressStep } from "react-native-progress-steps";

const OrderPreviewScreen = (props) => {
  const address = DrugStore.addresses[props.route.params.address];
  const fileUrl = props.route.params.fileUrl;
  const prescriptionUploaded = props.route.params.prescriptionUploaded;

  // const paymentMode = props.route.params.paymentMode;

  // console.log(props.route.params.noPrescriptionRequired);

  // console.log("address", address);
  // console.log("file", fileUrl);
  // console.log("paymentmode", paymentMode);

  const { drugs } = DrugStore;
  let total_checkout_amt = 0;

  // const [totalAmount, setTotalAmount] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);
  // const [orderStatus, setOrderStatus] = useState(false);

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
  // setTotalAmount(total_checkout_amt);

  // console.log(total_checkout_amt);

  const toISTString = (unixtime) => {
    const dateObject = new Date(unixtime);
    const humanDateFormat = dateObject.toString();
    // return humanDateFormat.substring(0, humanDateFormat.indexOf("G"));
    return humanDateFormat.substring(0, humanDateFormat.indexOf(":") - 3);
  };

  const createOrder = async () => {
    const response = await fetch(
      "https://razorpay-payments-api.herokuapp.com/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.trunc(total_checkout_amt * 100),
          currency: "INR",
          receipt: "rcptid_11",
        }),
      }
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
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.69,
        }}
        pointerEvents="none"
      >
        <ProgressSteps activeStep={1} marginBottom={0}>
          <ProgressStep
            label="Select Address"
            previousBtnText=""
            nextBtnText=""
          ></ProgressStep>
          <ProgressStep
            label="OrderPreview"
            previousBtnText=""
            nextBtnText=""
          ></ProgressStep>
          <ProgressStep
            label="Payment"
            previousBtnText=""
            nextBtnText=""
          ></ProgressStep>
        </ProgressSteps>
      </View>
      <View style={styles.item}>
        <View style={styles.textCont}>
          <Text style={styles.BoldText}>Order Date</Text>
          <Text>{toISTString(new Date())}</Text>
        </View>
        <View style={styles.textCont}>
          {/* <Text style={styles.BoldText}>Order #</Text>

          <Text>{"sample"}</Text> */}
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
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ paddingVertical: 25, fontSize: 30, fontWeight: "bold" }}>
          Address
        </Text>
        <Address
          type={address.type}
          name={address.name}
          ph_no={address.ph_no}
          add_line_1={address.add_line_1}
          add_line_2={address.add_line_2}
        />
        {/* Match with an RE pattern */}
        {!props.route.params.noPrescriptionRequired && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderWidth: 0.5,
              borderColor: "#000",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text
            // onPress={() => {
            //   Linking.openURL(fileUrl);
            // }}
            >
              Prescription Uploaded
            </Text>
            <Text style={{ fontWeight: "bold", color: "green" }}>
              {prescriptionUploaded ? "Yes" : "No"}
            </Text>
          </View>
        )}
      </View>
      <View style={{ paddingHorizontal: 20, alignItems: "center" }}>
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
              console.log("amt", total_checkout_amt * 100);
              console.log("id", id);
              const options = {
                description: `${drugs.length} Medicines you ordered.`, //product description
                image:
                  "https://media.npr.org/assets/img/2020/03/09/gettyimages-88160320_wide-27e22851a1aaf72f2e66e280f55d0c28c81ec7bb.jpg?s=1400", // product image
                currency: "INR",
                key: "rzp_test_JTQ6Nksjcb9tRj", // secure this key
                amount: total_checkout_amt * 100,
                name: ordername,
                order_id: id, // order_id recieved after
                prefill: {
                  email: email,
                  contact: contact,
                  name: name,
                  // method: "card", //default payment method
                },
                theme: { color: "#000000" },
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
                      DrugStore.addOrder({
                        items: DrugStore.drugs,
                        datetimestamp: new Date().getTime(),
                        address: address,
                        total_amt: total_checkout_amt,
                        order_id: id,
                        status: data.status,
                        prescription: fileUrl,
                      }).then(() => {
                        // console.log("statuss", data.status);

                        props.navigation.navigate("OrderConfirmation", {
                          status: data.status,
                        });
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
                  console.log(
                    `Error: ${error} ${error.code} | ${error.description}`
                  );
                  setCheckingOut(false);
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
    // marginBottom: 40,
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
