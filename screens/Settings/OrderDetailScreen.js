// FIXME: change the testing uuid to a permanent one assigned when order is successful

import { observer } from "mobx-react";
import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

const OrderDetailScreen = observer((props) => {
  const item = props.route.params.item_;
  console.log("ITEM", item);

  const toISTString = (unixtime) => {
    const dateObject = new Date(unixtime);
    const humanDateFormat = dateObject.toString();
    // return humanDateFormat.substring(0, humanDateFormat.indexOf("G"));
    return humanDateFormat.substring(0, humanDateFormat.indexOf(":") - 3);
  };

  // for testing
  // const uuidgen = () => {
  //   const S4 = function () {
  //     return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  //   };
  //   const uuid =
  //     S4() +
  //     S4() +
  //     "-" +
  //     S4() +
  //     "-" +
  //     S4() +
  //     "-" +
  //     S4() +
  //     "-" +
  //     S4() +
  //     S4() +
  //     S4();

  //   console.log(uuid);

  //   return uuid;
  // };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.item}>
        <View style={styles.textCont}>
          <Text style={styles.BoldText}>Order Date</Text>
          <Text>{toISTString(item.datetimestamp)}</Text>
        </View>
        <View style={styles.textCont}>
          <Text style={styles.BoldText}>Order #</Text>

          <Text>{"sample"}</Text>
        </View>
        <View style={styles.textCont}>
          <Text style={styles.BoldText}>Order Total</Text>
          <Text style={{ color: "green", fontWeight: "bold" }}>
            ₹{item.total_amt.toFixed(0)}
          </Text>
        </View>
      </View>

      <Text style={{ padding: 25, fontSize: 30, fontWeight: "bold" }}>
        Items
      </Text>
      <View style={{ padding: 0 }}>
        {item.items.map((item, index) => (
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
    </ScrollView>
  );
});

export const screenOptions = (navData) => {
  return {
    headerLargeTitle: true,
    headerTitle: "Order",
  };
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

export default OrderDetailScreen;
