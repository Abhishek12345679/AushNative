import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";

import FlashMessage, { showMessage } from "react-native-flash-message";

import DrugStore from "../store/CartStore";

import { FontAwesome5 } from "@expo/vector-icons";

import Tooltip from "react-native-walkthrough-tooltip";

import { gql, useMutation } from "@apollo/client";

const ADD_TO_DB = gql`
  mutation addToDB($input: DrugInput!) {
    createDrug(input: $input) {
      id
      name
    }
  }
`;

const DrugImporterScreen = (props) => {
  const item = props.route.params.importedItem;
  const snackbarRef = useRef();

  let [addingToCart, setAddingToCart] = useState(false);
  let [addingToDB, setAddingToDB] = useState(false);

  const [cartItem, setCartItem] = useState({
    name: "",
    salt: "",
    price: 0,
    quantity: 0,
    prescription_req: false,
    total_amt: 0,
    description: {
      introduction: "",
      uses: [],
      side_effects: [],
    },
  });

  useEffect(() => {
    setCartItem({
      name: item.name,
      salt: item.salt,
      price: parseFloat(parseFloat(item.price).toFixed(2)),
      quantity: 1,
      prescription_req: item.requires_prescription,
      total_amt: parseInt(1) * parseFloat(parseFloat(item.price).toFixed(2)),
    });
  }, [item]);

  const [toolTipVisible, setToolTipVisible] = useState(false);

  const [addToDB, { data }] = useMutation(ADD_TO_DB);

  let [med, setMed] = useState({
    name: "",
    salt: "",
    manufacturer_name: "",
    habit_forming: false,
    price: "",
    requires_prescription: "",
    description: {
      introduction: "",
      uses: [],
      side_effects: [],
      how_to_use: "",
      how_to_cope_with_side_effects: [],
      how_does_it_work: "",
      safety_advice: [],
    },
  });

  useEffect(() => {
    setMed({
      name: item.name,
      salt: item.salt,
      manufacturer_name: item.manufacturer_name,
      habit_forming: false,
      price: item.price,
      requires_prescription: item.requires_prescription,
      description: {
        introduction: item.description.introduction,
        uses: item.description.uses,
        side_effects: item.description.side_effects,
        how_to_use: "",
        how_to_cope_with_side_effects: [],
        how_does_it_work: "",
        safety_advice: [],
      },
    });
  }, [item]);

  const addToCart = () => {
    DrugStore.addDrug(cartItem);
  };

  console.log("med - - - ", med);

  return (
    <ScrollView>
      {Platform.OS === "ios" && (
        <StatusBar barStyle="light-content" backgroundColor="#000" />
      )}

      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center" }}
        onPress={() => props.navigation.pop()}
      >
        <FontAwesome5 name="angle-down" size={35} color="#000" />
      </TouchableOpacity>
      <View style={styles.content}>
        {/* <Button title="x"  /> */}

        <View style={styles.imageContainer}>
          <Text style={styles.bigTitle}>{item.name}</Text>
        </View>
        <View>
          <Text style={{ color: "#0000FF" }}>Manufacturer</Text>
          <Text>{item.manufacturer_name}</Text>
        </View>

        <View style={styles.row}>
          <View style={{ width: "70%" }}>
            <Text style={{ color: "#0000FF" }}>Salt</Text>
            <Text style={styles.salt}>{item.salt}</Text>
          </View>
          {item.requires_prescription && (
            <Tooltip
              isVisible={toolTipVisible}
              content={
                <View>
                  <Text>Prescription Required</Text>
                </View>
              }
              placement="left"
              onClose={() => setToolTipVisible(false)}
            >
              <TouchableOpacity
                style={{ height: 50, width: 50 }}
                onPress={() => setToolTipVisible(true)}
              >
                <Image
                  source={require("../assets/pharmacy.png")}
                  style={{ height: 50, width: 50 }}
                />
              </TouchableOpacity>
            </Tooltip>
          )}
        </View>
        <View
          style={{
            // width: "100%",

            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={styles.buyBtn}
            onPress={() => {
              // await triggerNotification();
              setAddingToCart(true);
              setTimeout(() => {
                setAddingToCart(false);
                snackbarRef.current.showMessage({
                  message: `${item.quantity} ${item.name} added to Cart`,
                  type: "success",
                  position: "top",
                });
              }, 3000);
              addToCart(cartItem);
            }}
          >
            {!addingToCart ? (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "#ffffff",
                    width: 150, // tweaked off center for android
                  }}
                >
                  ₹ {item.price}
                </Text>
                <Text style={{ fontSize: 12, color: "#ffffff" }}>
                  {item.quantity}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
            {/* <Text style={{ fontSize: 50, color: "#fff", fontWeight: "100" }}>
              |
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
              BUY
            </Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.buyBtn, marginEnd: 10 }}
            onPress={() => {
              setAddingToDB(true);
              setTimeout(() => {
                setAddingToDB(false);
                snackbarRef.current.showMessage({
                  message: `${item.quantity} ${item.name} added to the Medlads/Chemy Databases`,
                  type: "success",
                  position: "top",
                });
              }, 3000);
              addToDB({ variables: { input: med } });
            }}
          >
            {!addingToDB ? (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#ffffff",
                    textAlign: "center",
                  }}
                >
                  Add to Database
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.desc}>
        <Text style={{ ...styles.salt, fontWeight: "bold" }}>Introduction</Text>
        <Text style={{ marginTop: 5 }}>{item.description.introduction}</Text>
      </View>

      <View style={styles.desc}>
        <Text style={{ ...styles.salt, fontWeight: "bold" }}>Uses</Text>
        {item.description.uses.map((itemData) => (
          <Text
            key={itemData}
            style={{ marginTop: 5 }}
          >{`\u2022 ${itemData}`}</Text>
        ))}
      </View>

      <View style={styles.desc}>
        <Text style={{ ...styles.salt, fontWeight: "bold" }}>Side Effects</Text>
        {item.description.side_effects.map((itemData) => (
          <Text
            key={itemData}
            style={{ marginTop: 5 }}
          >{`\u2022 ${itemData}`}</Text>
        ))}
      </View>
      {/* 
      <View style={styles.desc}>
        <Text style={{ ...styles.salt, fontWeight: "bold" }}>
          How to cope with side effects
        </Text>
        {item.description.how_to_cope_with_side_effects.map((itemData) => (
          <View style={{ marginBottom: 20 }} key={itemData.question}>
            <Text
              style={{ marginTop: 5, fontSize: 20 }}
            >{`\u2022 ${itemData.question}`}</Text>
            <Text style={{ marginTop: 5 }}>{itemData.answer}</Text>
          </View>
        ))}
      </View> */}

      <View style={styles.desc}>
        <Text style={{ ...styles.salt, fontWeight: "bold" }}>How to Use</Text>
        <Text style={{ marginTop: 5 }}>{item.description.how_to_use}</Text>
      </View>

      {/* <View style={styles.desc}>
        <Text style={{ ...styles.salt, fontWeight: "bold" }}>
          FAQ
        </Text>
        {item.description.safety_advice.map((itemData) => (
          <View style={{ marginBottom: 20 }} key={itemData.question}>
            <Text
              style={{ marginTop: 5, fontSize: 20 }}
            >{`\u2022 ${itemData.question}`}</Text>
            <Text style={{ marginTop: 5 }}>{itemData.answer}</Text>
          </View>
        ))}
      </View> */}
      <FlashMessage ref={snackbarRef} />
    </ScrollView>
  );
};

// export const screenOptions = (navData) => {
//   const title = navData.route.params.importedItem.name;
//   // console.log(title);
//   return {
//     headerTitle: title,
//     headerLargeTitle: true,
//     // headerShown: true,
//     // gestureEnabled: false,
//   };
// };

const styles = StyleSheet.create({
  content: {
    // alignItems: "center",
    marginTop: 5,
    flexDirection: "column",
    marginStart: 15,
  },
  imageContainer: {
    width: "95%",
    backgroundColor: "#000",
    height: 200,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  bigTitle: {
    fontSize: 50,
    fontWeight: "600",
    color: "#fff",
  },
  salt: {
    fontSize: 20,
    fontWeight: "400",
    color: "#000",
  },
  row: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    // marginHorizontal: 10,
    alignItems: "center",
    // paddingHorizontal: 25,
    marginTop: 10,
  },
  buyBtn: {
    width: "45%",
    height: 70,
    backgroundColor: "#e75468",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 15,
  },
  desc: {
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    marginTop: 10,
  },
});

export default DrugImporterScreen;
