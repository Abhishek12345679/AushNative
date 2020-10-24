import { Formik } from "formik";
import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Button,
} from "react-native";
import RoundButton from "../../components/RoundButton";
import DrugStore from "../../store/CartStore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";

import * as Firebase from "firebase";
import DP from "../../components/DP";
const chalk = require("chalk");

const EditProfileScreen = observer((props) => {
  // const age = props.route.params.dob;
  const name = DrugStore.profile.name;
  //   console.log(age);

  const [age, setAge] = useState(props.route.params.dob);

  const [dob, setDob] = useState(new Date().getTime());

  const [image, setImage] = useState(DrugStore.profile.display_picture);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.uri);

    if (!result.cancelled) {
      console.log("in...");
      setImage(result.uri);
      DrugStore.setPFP(result.uri);
    }
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date.getTime());
    setDob(date.getTime());
    const age = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24 * 365));
    setAge(age);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <ScrollView>
        <Formik
          initialValues={{
            name: name,
            imageUrl: image,
            dob: DrugStore.profile.dob,
          }}
          onSubmit={(values) => {
            // DrugStore.editProfile(values.name, values.imageUrl, dob);
            DrugStore.setExtra(age, image);
            // DrugStore.setPFP(image);

            //firebase update()
            var user = Firebase.auth().currentUser;

            user
              .updateProfile({
                displayName: values.name,
                photoURL: values.imageUrl,
              })
              .then(function () {
                // Update successful.
                console.log(chalk.green("Updated Profile Successfully! "));
                DrugStore.setName(user.displayName);
              })
              .catch(function (error) {
                console.log(chalk.red("Updating Profile Failed! "));
              });

            DrugStore.getExtra();

            props.navigation.pop();
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 20,
                  borderBottomColor: "#aaa",
                  borderBottomWidth: 1,
                  paddingBottom: 20,
                }}
              >
                <View>
                  <TextInput
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginVertical: 5,
                      padding: 3,
                      paddingRight: 20,
                      textAlign: "left",
                      color: "#000",
                      borderWidth: 1,
                      borderColor: "#ccc",
                      alignItems: "flex-start",
                    }}
                    value={values.name}
                    onChangeText={handleChange("name")}
                  />
                  <Text style={{ color: "#000" }}>
                    {DrugStore.userCredentials.email}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 10,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      {age}+
                    </Text>

                    <Button title="Edit" onPress={showDatePicker} />

                    {/* <RoundButton style={{ width: 25, height: 25, marginEnd: 5 }}>
              <Text style={{ color: "#fff" }}>A</Text>
            </RoundButton>
            <RoundButton style={{ width: 25, height: 25 }}>
              <Text style={{ color: "#fff" }}>B</Text>
            </RoundButton> */}
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    // backgroundColor: "#CCC",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={pickImage}
                >
                  {/* <Image
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "#CCC",
                    }}
                    source={{
                      uri: image,
                    }}
                  /> */}
                  <DP
                    inner={{ width: 100, height: 100, borderRadius: 50 }}
                    outer={{ width: 110, height: 110, borderRadius: 55 }}
                  />
                </TouchableOpacity>
              </View>
              <Button title="Save" onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        // isDarkModeEnabled={false}
      />
    </SafeAreaView>
  );
});

export default EditProfileScreen;
