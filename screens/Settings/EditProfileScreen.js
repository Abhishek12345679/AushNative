import { Formik } from "formik";
import { observer } from "mobx-react";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import DrugStore from "../../store/CartStore";
import * as ImagePicker from "expo-image-picker";

import storage from "@react-native-firebase/storage";
import DP from "../../components/DP";
import { Form, Input, Item, Label } from "native-base";

const EditProfileScreen = observer((props) => {
  const name = DrugStore.profile.name;

  //states
  const [age, setAge] = useState(props.route.params.dob);
  const [image, setImage] = useState(DrugStore.profile.display_picture);
  const [loading, setLoading] = useState(false);

  //refs
  const formRef = useRef();

  const saveInput = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
      props.navigation.goBack();
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestCameraRollPermissionsAsync();
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
      base64: true,
    });

    if (!result.cancelled) {
      // setImage(result.uri);
      console.log(result.uri);
      await uploadImageAsync(result.uri);
      // console.log(downloadUrl);
    }
  };

  const uploadImageAsync = async (uri) => {
    setLoading(true);
    const ref = storage().ref(`/dp/${DrugStore.userCredentials.uid}.jpg`);
    // .child(`/${DrugStore.userCredentials.uid}.png`);
    // const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/black-t-shirt-sm.png`;
    const snapshot = ref.putFile(uri);

    snapshot.on(
      storage().TaskEvent.STATE_CHANGED,
      (s) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (s.bytesTransferred / s.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (s.state) {
          case storage().TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case storage().TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
        return;
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        snapshot.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          // return downloadURL;
          setImage(downloadURL);
          console.log(downloadURL);
          setLoading(false);
        });
      }
    );
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            saveInput();
          }}
        >
          <Text>Done</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.pop();
          }}
        >
          <Text>close</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        flex: 1,
        marginTop: 90,
      }}
    >
      <Formik
        innerRef={formRef}
        initialValues={{
          name: name,
          // dob: DrugStore.profile.dob,
          imageUrl: image,
        }}
        onSubmit={(values) => {
          DrugStore.setPFP(values.imageUrl);

          DrugStore.setName(values.name);
          var user = Firebase.auth().currentUser;

          user
            .updateProfile({
              displayName: values.name,
              photoURL: image,
            })
            .then(() => {
              // Update successful.
              console.log("Updated Profile Successfully! ");
              DrugStore.setName(user.displayName);
            })
            .catch((error) => {
              // update unsuccessful
              console.log("Updating Profile Failed! -  ", error);
            });
        }}
      >
        {({ handleChange, handleBlur, values }) => (
          <ScrollView>
            <View
              style={{
                height: 120,
                width: "100%",
                alignItems: "center",
                marginTop: 10,
                flexDirection: "column",
                // justifyContent: "center",
              }}
            >
              {/* <Button title="save" onPress={handleSubmit} /> */}
              <DP
                editMode
                loading={loading}
                profile_picture={image}
                outer={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  marginBottom: 10,
                  marginEnd: 0,
                }}
                inner={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  // borderColor: "#fff",
                  // borderWidth: 1,
                }}
              />
              <TouchableOpacity
                onPress={pickImage}
                // style={{ backgroundColor: "#000" }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 15,
                    textAlign: "center",
                    color: "#000",
                  }}
                >
                  Edit Profile Picture
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 30 }}>
              <Form>
                <Item floatingLabel>
                  <Label>Name</Label>
                  <Input
                    blurOnSubmit={true}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    onChangeText={handleChange("name")}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Username</Label>
                  <Input
                    // placeholder="enter a username"
                    // placeholderTextColor="#CCC"
                    value={"edit"}
                    style={{ color: "#ccc" }}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>e-mail</Label>
                  <Input value={DrugStore.userCredentials.email} />
                </Item>
                <Item floatingLabel>
                  <Label>Age</Label>
                  <Input value={age.toString()} />
                </Item>
              </Form>
            </View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
});

export default EditProfileScreen;
