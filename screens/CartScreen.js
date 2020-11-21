import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  Linking,
} from "react-native";

import { showMessage } from "react-native-flash-message";

import QuantitySelector from "../components/QuantitySelector";

import DrugStore from "../store/CartStore";
import { observer } from "mobx-react";

import { FontAwesome } from "@expo/vector-icons";

const CartScreen = observer((props) => {
  const { drugs } = DrugStore;
  let total_checkout_amt = 0;

  const [checkingOut, setCheckingOut] = useState(false);

  // console.log(drugs[1].quantity);

  for (let i = 0; i < drugs.length; i++) {
    total_checkout_amt = total_checkout_amt + drugs[i].total_amt;
  }

  useEffect(() => {
    DrugStore.fetchOrders();
  }, [DrugStore]);

  const removeFromCart = (id) => {
    DrugStore.removeFromCart(id);
  };

  const submitOrder = () => {
    // Alert.alert(
    //   "Confirm",
    //   "Do you want to continue to the payment options ?",
    //   [
    //     {
    //       text: "Cancel",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel",
    //     },
    //     {
    //       text: "yes",
    //       onPress: () => {
    //         props.navigation.navigate("CheckoutFlow");
    //       },
    //     },
    //   ],
    //   { cancelable: true }
    // );
    props.navigation.navigate("CheckoutFlow");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {Platform.OS === "android" && <StatusBar barStyle="dark-content" />}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <View style={{ width: "50%" }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Your Meds</Text>
        </View>
        <View>
          <Text style={{ fontSize: 20 }}>Total : </Text>
          <Text style={{ fontSize: 20, color: "green" }}>
            {" "}
            ₹{total_checkout_amt.toFixed(2)}
          </Text>
        </View>
      </View>
      {drugs.length > 0 ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#000",
            // flexGrow: 1,
          }}
        >
          {drugs.map((drug, index) => (
            <View
              key={index}
              style={{
                borderColor: drugs.length > 1 && "#000",
                borderWidth: drugs.length > 1 && 1,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                }}
              >
                <View style={{ flexDirection: "row", marginEnd: 10 }}>
                  <Text
                    style={{ fontSize: 25, marginEnd: 10, fontWeight: "bold" }}
                  >
                    {drug.quantity}
                  </Text>
                  <View style={{ marginEnd: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      {drug.name}
                    </Text>
                    <Text style={{ fontSize: 15, width: 200 }}>
                      {drug.salt}
                    </Text>
                  </View>
                </View>
                {/* <Text style={{ color: "green", fontWeight: "bold" }}>
                  ₹{drug.total_amt}
                </Text> */}
              </View>

              <View style={{ marginStart: 10, marginVertical: 10 }}>
                {/* <QuantitySelector /> */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    {/* <Text style={{ marginHorizontal: 10, fontSize: 20 }}>
                      {drug.quantity}
                    </Text> */}
                    <Text style={{ color: "green" }}>₹ {drug.price}</Text>
                    <Text> x {drug.quantity} = </Text>
                    <Text style={{ color: "green", fontWeight: "bold" }}>
                      ₹{drug.total_amt.toFixed(2)}
                    </Text>
                  </View>
                  <FontAwesome
                    name="trash"
                    size={24}
                    onPress={() => {
                      // console.log("item removed");
                      console.log(drug.id);
                      removeFromCart(drug.id);
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={{ ...styles.centered, justifyContent: "center" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 50,
            }}
          >
            <Image
              source={require("../assets/nomed.png")}
              style={{ height: 300, width: 200 }}
            />
            <Text>
              Courtesy :{" "}
              <Text
                style={{
                  color: "purple",
                  textDecorationLine: "underline",
                }}
                onPress={() => Linking.openURL("https://www.1mg.com")}
              >
                1mg.com
              </Text>
            </Text>
          </View>
          <Text>No Mad Meds 💩</Text>
        </View>
      )}
      {drugs.length > 0 && (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "flex-end",
            // marginBottom: 30,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.scanButton}
            onPress={() => {
              props.navigation.navigate("Scan");
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "500", fontSize: 17 }}>
              Scan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={submitOrder}
            style={{
              width: "100%",
              height: 70,
              backgroundColor: "#000",
              alignItems: "center",
              justifyContent: "center",
              // marginTop: 10,
              marginBottom: 10,
            }}
          >
            {!checkingOut ? (
              <Text style={{ color: "#fff", fontSize: 20 }}>Checkout</Text>
            ) : (
              <View>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.centered}>
        <Text>Chemy/Medlads India ⓒ 2020</Text>
        <Text>{`< > with ♥️ in 🇮🇳`}</Text>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  centered: {
    // flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default CartScreen;
