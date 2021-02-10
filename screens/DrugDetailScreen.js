/* TODO: quantity for each product (as in 10 vial bottle , 20 tablets, 50ml syrup bottle) need to be
         added somehow to the existing database (rerunning the process or finding a way to add the details more flexibly)
*/

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";

import IconBadge from "react-native-icon-badge";

import { showMessage } from "react-native-flash-message";

import { gql, useQuery } from "@apollo/client";

import Tooltip from "react-native-walkthrough-tooltip";

import * as Notification from "expo-notifications";
import * as Permissions from "expo-permissions";

import Card from "../components/Card";
import QuantitySelector from "../components/QuantitySelector";
import { observer } from "mobx-react";

import DrugStore from "../store/CartStore";

Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
    };
  },
});

const GET_ALTERNATE_DRUG = gql`
  query getAlternateDrug($salt: String!) {
    findDrugForSameSalt(salt: $salt) {
      drugs {
        id
        name
        salt
        price
        habit_forming
        requires_prescription
        manufacturer_name
        # description {
        #   introduction
        #   uses
        #   side_effects
        #   how_to_cope_with_side_effects {
        #     question
        #     answer
        #   }
        #   how_to_use
        #   how_does_it_work
        #   safety_advice {
        #     question
        #     answer
        #   }
        # }
      }
      items
    }
  }
`;

const DrugDetailScreen = observer((props) => {
  let [quantity, setQuantity] = useState("1");
  let [initialValue, setInitialValue] = useState(1);

  let [addingToCart, setAddingToCart] = useState(false);

  let [introCollapsed, setIntroCollapsed] = useState(false);
  let [usesCollapsed, setUsesCollapsed] = useState(false);
  let [sideEffectsCollapsed, setSideEffectsCollapsed] = useState(false);
  let [howToSECollpased, setHowToSECollapsed] = useState(false);
  let [howToUseCollapsed, setHowToUseCollapsed] = useState(false);
  let [safetyAdviceCollapsed, setSafetyAdviceCollapsed] = useState(false);

  //workaround
  const [cartCount, setCartCount] = useState(0);

  const onIncrease = () => {
    setQuantity((initialValue + 1).toString());
    setInitialValue(initialValue + 1);
  };

  const onDecrease = () => {
    if (initialValue >= 2) {
      setQuantity((initialValue - 1).toString());
      setInitialValue(initialValue - 1);
    }
  };

  const [cartItem, setCartItem] = useState({
    name: "",
    salt: "",
    price: 0,
    quantity: 0,
    prescription_req: false,
    total_amt: 0,
  });

  const addToCart = () => {
    DrugStore.addDrug(cartItem);
    setCartCount(cartCount + 1);
    // DrugStore.addone();
    // DrugStore.getCount;
  };

  const item = props.route.params.item;

  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [pushToken, setPushToken] = useState();

  const { data, loading, error } = useQuery(GET_ALTERNATE_DRUG, {
    variables: { salt: item.salt },
  });

  // const triggerNotification = async () => {
  //   // Notification.scheduleNotificationAsync({
  //   //   content: {
  //   //     title: "Badhai Ho 🤪",
  //   //     body: "SALE SALE",
  //   //     sound: true,
  //   //   },
  //   //   trigger: {
  //   //     seconds: 5,
  //   //   },
  //   // });

  //   const message = {
  //     to: pushToken,
  //     sound: "default",
  //     title: "Damn Son",
  //     body: "Where'd you find that",
  //     data: { data: "goes here" },
  //   };

  //   await fetch("https://exp.host/--/api/v2/push/send", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Accept-encoding": "gzip, deflate",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(message),
  //   });
  // };

  // useEffect(() => {
  //   Permissions.getAsync(Permissions.NOTIFICATIONS)
  //     .then((statusObj) => {
  //       if (statusObj.status !== "granted") {
  //         return Permissions.askAsync(Permissions.NOTIFICATIONS);
  //       }
  //       return statusObj;
  //     })
  //     .then((statusObj) => {
  //       if (statusObj.status !== "granted") {
  //         return;
  //       }
  //     })
  //     .then(() => {
  //       return Notification.getExpoPushTokenAsync();
  //     })
  //     .then((response) => {
  //       const expoPushToken = response.data;
  //       console.log(expoPushToken);
  //       setPushToken(expoPushToken);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       return null;
  //     });
  // }, []);

  // useEffect(() => {
  //   const backgroundSubscription = Notification.addNotificationResponseReceivedListener(
  //     (response) => console.log(response)
  //   );
  //   const foregroundSubscription = Notification.addNotificationReceivedListener(
  //     (notification) => console.log(notification)
  //   );
  //   return () => {
  //     backgroundSubscription.remove();
  //     foregroundSubscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
        >
          <IconBadge
            MainElement={
              <Image
                source={require("../assets/bag.png")}
                style={{ height: 25, width: 25, marginTop: 0 }}
              />
            }
            BadgeElement={
              <Text style={{ color: "#FFFFFF" }}>{DrugStore.count}</Text>
            }
            IconBadgeStyle={{
              width: 10,
              height: 20,
              backgroundColor: "purple",
              marginTop: 5,
            }}
            Hidden={DrugStore.count == 0}
          />
        </TouchableOpacity>
        // <Text style={{ color: "#000" }}>{DrugStore.count}</Text>
      ),
    });
  }, [cartCount]);

  useEffect(() => {
    setCartItem({
      id: item.id,
      name: item.name,
      salt: item.salt,
      price: parseFloat(parseFloat(item.price).toFixed(2)),
      quantity: parseInt(quantity),
      prescription_req: item.requires_prescription,
      total_amt:
        parseInt(quantity) * parseFloat(parseFloat(item.price).toFixed(2)),
    });
  }, [item, quantity]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: "75%",
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <Text> Looking for similar medicines with </Text>
        <Text>same salt composition</Text>

        <ActivityIndicator size="large" color="#000" />
        {/* <Image
          source={{
            uri: "https://media.giphy.com/media/l3nWhI38IWDofyDrW/giphy.gif",
          }}
          style={{ height: 400, width: 400 }}
        /> */}
      </View>
    );
  }

  if (error) {
    console.error(error);
  }

  if (data) console.log(data);

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1 }}>
        {Platform.OS === "ios" && (
          <StatusBar barStyle="dark-content" backgroundColor="#000" />
        )}
        <View style={{ marginStart: 15, marginTop: 0 }}>
          <Text style={{ color: "#0000FF" }}> Manufacturer </Text>
          <Text> {item.manufacturer_name} </Text>
        </View>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <View style={{ width: "90%", alignItems: "center" }}>
              <Text style={styles.bigTitle}> {item.name} </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ width: "70%" }}>
              <Text style={{ color: "#0000FF" }}> Salt </Text>
              <Text style={styles.salt}> {item.salt} </Text>
            </View>
            {item.requires_prescription && (
              <Tooltip
                isVisible={toolTipVisible}
                content={
                  <View>
                    <Text> Prescription Required </Text>
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
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 70,
              marginTop: 15,
              paddingHorizontal: 15,
            }}
          >
            <TouchableOpacity
              style={styles.buyBtn}
              onPress={() => {
                setAddingToCart(true);
                setTimeout(() => {
                  addToCart(cartItem);
                  showMessage({
                    message: `${quantity} ${item.name} added to Cart`,
                    type: "success",
                  });
                  setAddingToCart(false);
                }, 1000);
              }}
            >
              {!addingToCart ? (
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 35,
                        fontWeight: "bold",
                        color: "#ffffff",
                      }}
                    >
                      ₹{item.price}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, color: "#fff" }}>
                    Add to cart
                  </Text>
                </View>
              ) : (
                <ActivityIndicator size="large" color="#FFF" />
              )}
              {/* <Text style={{ fontSize: 50, color: "#fff", fontWeight: "100" }}>
              |
            </Text> */}
            </TouchableOpacity>
            <QuantitySelector
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              quantity={quantity}
            />
          </View>
        </View>
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.salt, fontWeight: "bold" }}>
              Introduction
            </Text>
            <Text
              onPress={() => setIntroCollapsed((prev) => !prev)}
              style={{ color: "purple", fontWeight: "bold" }}
            >
              [More]
            </Text>
          </View>
          {introCollapsed && (
            <Text style={{ marginTop: 5 }}>
              {item.description.introduction}
            </Text>
          )}
        </View>
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.salt, fontWeight: "bold" }}>Uses</Text>
            <Text
              onPress={() => setUsesCollapsed((prev) => !prev)}
              style={{ color: "purple", fontWeight: "bold" }}
            >
              [More]
            </Text>
          </View>
          {usesCollapsed &&
            item.description.uses.map((itemData) => (
              <Text key={itemData} style={{ marginTop: 5 }}>
                {`\u2022 ${itemData}`}
              </Text>
            ))}
        </View>
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.salt, fontWeight: "bold" }}>
              Side Effects
            </Text>
            <Text
              onPress={() => setSideEffectsCollapsed((prev) => !prev)}
              style={{ color: "purple", fontWeight: "bold" }}
            >
              [More]
            </Text>
          </View>
          {sideEffectsCollapsed &&
            item.description.side_effects.map((itemData) => (
              <Text key={itemData} style={{ marginTop: 5 }}>
                {`\u2022 ${itemData}`}
              </Text>
            ))}
        </View>
        {/* <View style={styles.desc}> */}
        {/* {data && data.findDrugForSameSalt.drugs && (
                    <View style={{ marginVertical: 15 }}>
                      <Text style={{ ...styles.salt, fontWeight: "bold", marginStart: 25 }}>
                        Alternate Brands
                      </Text>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={data.findDrugForSameSalt.drugs}
                        renderItem={(itemData) => {
                          return <Card name={itemData.item.name} />;
                        }}
                      />
                    </View>
                  )} */}
        {/* </View> */}
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.salt, fontWeight: "bold" }}>
              How to cope with side effects
            </Text>
            <Text
              onPress={() => setHowToSECollapsed((prev) => !prev)}
              style={{ color: "purple", fontWeight: "bold" }}
            >
              [More]
            </Text>
          </View>

          {howToSECollpased &&
            item.description.how_to_cope_with_side_effects.map((itemData) => (
              <View style={{ marginBottom: 20 }} key={itemData.question}>
                <Text style={{ marginTop: 5, fontSize: 20 }}>
                  {`\u2022 ${itemData.question}`}
                </Text>
                <Text style={{ marginTop: 5 }}> {itemData.answer} </Text>
              </View>
            ))}
        </View>
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.salt, fontWeight: "bold" }}>
              How to Use
            </Text>
            <Text
              onPress={() => setHowToUseCollapsed((prev) => !prev)}
              style={{ color: "purple", fontWeight: "bold" }}
            >
              [More]
            </Text>
          </View>
          {howToUseCollapsed && (
            <Text style={{ marginTop: 5 }}>{item.description.how_to_use}</Text>
          )}
        </View>
        <View style={{ ...styles.desc, marginBottom: 40 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.salt, fontWeight: "bold" }}>
              Safety Advice
            </Text>
            <Text
              onPress={() => setSafetyAdviceCollapsed((prev) => !prev)}
              style={{ color: "purple", fontWeight: "bold" }}
            >
              [More]
            </Text>
          </View>
          {safetyAdviceCollapsed &&
            item.description.safety_advice.map((itemData) => (
              <View style={{ marginBottom: 20 }} key={itemData.question}>
                <Text style={{ marginTop: 5, fontSize: 20 }}>
                  {`\u2022 ${itemData.question}`}
                </Text>
                <Text style={{ marginTop: 5 }}> {itemData.answer} </Text>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
    marginTop: 5,
    flexDirection: "column",
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
    marginHorizontal: 10,
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: 10,
  },
  buyBtn: {
    // flex: 1,
    width: 250,
    height: 70,
    backgroundColor: "#000",
    flexDirection: "column",
    justifyContent: "space-around",

    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 15,
    marginStart: 10,
  },
  desc: {
    justifyContent: "flex-start",
    paddingHorizontal: 25,
    marginTop: 10,
  },
});

// export const screenOptions = (navData) => {
//   const title = navData.route.params.item.name;
//   // console.log(title);
//   return {
//     headerTitle: title,
//     headerLargeTitle: true,
//     headerShown: true,
//   };
// };

export default DrugDetailScreen;
