import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import RadioButtonRN from "radio-buttons-react-native";

import DrugStore from "../store/CartStore";
import RoundButton from "../components/RoundButton";
import { showMessage } from "react-native-flash-message";
import { observer } from "mobx-react";

const AddAddressModalScreen = observer((props) => {
  const [addingAddress, setAddingAddress] = useState(false);
  const [type, setType] = useState("Home");

  const data = [
    {
      label: "Home",
    },
    {
      label: "Work",
    },
    {
      label: "Other",
    },
  ];

  const addAddress = (address) => {
    DrugStore.addNewAddress(address);
  };
  return (
    <ScrollView style={{ padding: 20 }}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior="position">
        <Formik
          initialValues={{
            // type: "",
            name: "",
            add_line_1: "",
            add_line_2: "",
            pincode: "",
            ph_no: "",
          }}
          onSubmit={(values) => {
            console.log("Submitting...");

            addAddress({
              type: type,
              name: values.name,
              add_line_1: values.add_line_1,
              add_line_2: values.add_line_2,
              pincode: values.pincode,
              ph_no: "+91" + values.ph_no,
            });
            showMessage({
              message: "New Address Added",
              type: "success",
              duration: 5000,
            });
            // props.navigation.navigate("Settings");
            DrugStore.fetchAddresses();
            props.navigation.pop();
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <TouchableOpacity
                onPress={() => props.navigation.pop()}
                style={{ alignItems: "center", height: 20 }}
              >
                <Ionicons name="ios-arrow-down" size={24} color="#000" />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                  Add New Address
                </Text>
                {!addingAddress ? (
                  <RoundButton onPress={handleSubmit}>
                    <Ionicons name="ios-add" size={24} color="#fff" />
                  </RoundButton>
                ) : (
                  <ActivityIndicator size="small" color="#fff" />
                )}
              </View>
              {/* <TextInput
                value={values.type}
                onChangeText={handleChange("type")}
                // onBlur={handleBlur("type")}
                // label="Type"
                // mode="flat"
                style={{
                  height: 60,
                  marginTop: 20,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                  // paddingHorizontal: 20,
                }}
                placeholder={"Home"}
                placeholderTextColor="#a7a8a9"
              /> */}
              <RadioButtonRN
                initial={1}
                data={data}
                selectedBtn={(e) => {
                  console.log(e);
                  setType(e.label);
                }}
                circleSize={16}
              />
              <TextInput
                onChangeText={handleChange("name")}
                // onBlur={handleBlur("name")}
                value={values.name}
                // label="Name"
                // mode="flat"
                style={{
                  height: 60,
                  marginTop: 20,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                placeholder={"Name"}
                placeholderTextColor="#a7a8a9"
              />

              <TextInput
                keyboardType="phone-pad"
                onChangeText={handleChange("ph_no")}
                // onBlur={handleBlur("ph_no")}
                value={values.ph_no}
                style={{
                  height: 60,
                  marginTop: 20,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                placeholder={"Mobile"}
                placeholderTextColor="#a7a8a9"
              />
              <TextInput
                maxLength={6}
                keyboardType="number-pad"
                onChangeText={handleChange("pincode")}
                // onBlur={handleBlur("pincode")}
                value={values.pincode}
                // label="Pincode"
                // mode="flat"
                style={{
                  height: 60,
                  marginTop: 20,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                placeholder={"pincode"}
                placeholderTextColor="#a7a8a9"
              />
              <TextInput
                onChangeText={handleChange("add_line_1")}
                // onBlur={handleBlur("add_line_1")}
                value={values.add_line_1}
                // label="Address Line 1"
                // mode="flat"
                style={{
                  height: 60,
                  marginTop: 20,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                placeholder={"Address Line 1"}
                placeholderTextColor="#a7a8a9"
              />
              <TextInput
                onChangeText={handleChange("add_line_2")}
                // onBlur={handleBlur("add_line_2")}
                value={values.add_line_2}
                // label="Address Line 2"
                // mode="flat"
                style={{
                  height: 60,
                  marginTop: 20,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                placeholder={"Address Line 2"}
                placeholderTextColor="#a7a8a9"
              />
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  );
});

export default AddAddressModalScreen;
