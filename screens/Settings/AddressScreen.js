import React, { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import DrugStore from "../../store/CartStore";

import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react";
import Address from "../../components/Address";

const AddressScreen = observer((props) => {
  const { navigation } = props;

  useEffect(() => {
    DrugStore.fetchAddresses();
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {DrugStore.addresses.map((add, index) => (
        <Address
          key={index}
          type={add.type}
          name={add.name}
          add_line_1={add.add_line_1}
          add_line_2={add.add_line_2}
          ph_no={add.ph_no}
          pincode={add.pincode}
        />
      ))}
    </ScrollView>
  );
});

export const screenOptions = (navData) => {
  return {
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navData.navigation.navigate("Add New Address")}
      >
        <Ionicons name="ios-add-circle-outline" size={24} color="blue" />
      </TouchableOpacity>
    ),
    headerLargeTitle: true,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
});

export default AddressScreen;
