import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Address from "../../components/Address";
import DrugStore from "../../store/CartStore";

import { Ionicons } from "@expo/vector-icons";

const SelectAddressScreen = (props) => {
  const [selectedAddress, setSelectedAddress] = useState(0);
  const { navigation } = props;
  useEffect(() => {
    // console.log(selectedAddress);
    DrugStore.fetchAddresses();
  }, [navigation]);
  console.log(DrugStore.addresses);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Select Address</Text>
        <Text>There are a few addresses available.</Text>
      </View> */}

      <FlatList
        keyExtractor={(item) => item.type}
        style={{ padding: 20 }}
        data={DrugStore.addresses}
        ListFooterComponent={
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
              props.navigation.navigate("SelectPayment", {
                address: DrugStore.addresses[selectedAddress],
              })
            }
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500" }}>
              Deliver to this address
            </Text>
          </TouchableOpacity>
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
    headerTitle: "Select Address",
    headerLargeTitle: true,
    // stackPresentation: "modal",
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navData.navigation.navigate("Add New Address")}
      >
        <Ionicons name="ios-add-circle-outline" size={24} color="blue" />
      </TouchableOpacity>
    ),
  };
};

export default SelectAddressScreen;
