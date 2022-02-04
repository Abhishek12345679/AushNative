import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Button,
} from "react-native";

import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import RadioButtonRN from "radio-buttons-react-native";

import { showMessage } from "react-native-flash-message";
import { observer } from "mobx-react";
import addAddresses from "../helpers/addAddress";
import { Pressable } from "react-native";

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

  return (
    <ScrollView style={{ padding: 20 }}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior="position">
        <Formik
          initialValues={{
            type: "",
            name: "",
            add_line_1: "",
            add_line_2: "",
            pincode: "",
            ph_no: "",
          }}
          onSubmit={async (values) => {
            console.log("Submitting...");

            await addAddresses({
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
              duration: 1000,
            });

            props.navigation.pop();
          }}
        >
          {({ handleChange, handleSubmit, values }) => (
            <ScrollView>
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
                value={values.name}
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
                value={values.pincode}
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
                value={values.add_line_1}
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
                value={values.add_line_2}
                style={{
                  height: 60,
                  marginTop: 20,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                placeholder={"Address Line 2"}
                placeholderTextColor="#a7a8a9"
              />
              <Button
                title="Add Address"
                style={{
                  width: 100,
                  height: 10,
                }}
                onPress={handleSubmit}
              />
              <Pressable
                style={{
                  width: 200,
                  height: 70,
                  backgroundColor: "#000",
                }}
                android_ripple={{
                  color: "#fff",
                  borderless: true,
                }}
                onPress={handleSubmit}
              >
                <Text>Add Address</Text>
              </Pressable>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  );
});

export default AddAddressModalScreen;
