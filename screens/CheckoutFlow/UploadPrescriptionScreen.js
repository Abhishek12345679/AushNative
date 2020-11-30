//TODO: show Upload progress correctly as close as possible (% not required)

import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";

import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import DrugStore from "../../store/CartStore";

import { Platform } from "react-native";
import { isRegExp } from "lodash";

const UploadPrescriptionScreen = (props) => {
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const addressIndex = props.route.params.address;

  //https://res.cloudinary.com/abhisheksah69420/raw/upload/v1606036086/Prescriptions/7WCAfGl2BiOB49OgOFxLycKFAsx2/rykh8utjw5j7wc3f4qiq
  const urlRegex = new RegExp(/^(https):\/\/[^\s$.?#].[^\s]*$/);
  const isValidUrl = urlRegex.test(file);
  console.log(isValidUrl);

  const getPrescriptionDoc = async () => {
    // Pick a single file
    try {
      setUploading(true);
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: "documentDirectory",
      });
      const uri = Platform.select({
        android: res.fileCopyUri,
        ios: decodeURIComponent(res.fileCopyUri)?.replace?.("file://", ""),
      });

      const base64File = await RNFS.readFile(uri, "base64");
      // Your file handling here
      // console.log(res);
      console.log(uri);
      // uploadPrescriptionDoc(`data:image/jpg;base64,${base64File}`);
      uploadPrescriptionDoc(uri);
      // setFile(`data:image/jpg;base64,${base64File}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        setUploading(false);
      } else {
        setUploading(false);
        throw err;
      }
    }
  };

  const uploadPrescriptionDoc = async (imageUrl) => {
    const response = await fetch("http://192.168.0.106:3000/upload", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        uid: DrugStore.userCredentials.uid,
        fileUrl: imageUrl,
      }),
    });
    const resData = await response.json();
    const status = response.status;
    console.log(resData);
    console.log("status", status);

    if (resData.secure_url) {
      console.log(resData.secure_url);
      setFile(resData.secure_url);
      setUploading(false);
    }
    // return resData.secure_url
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../../assets/prescription.png")}
          style={{ width: 256, height: 256, marginTop: 50 }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          // borderWidth: 0.5,
          // borderColor: "#000",
          padding: 10,
          borderRadius: 5,
          backgroundColor: "#000",
          marginHorizontal: 20,
          marginTop: 20,
        }}
      >
        <Text
          style={{ fontWeight: "bold", color: "#fff" }}
          // onPress={() => {
          //   Linking.openURL(fileUrl);
          // }}
        >
          Prescription Uploaded
        </Text>
        <Text style={{ fontWeight: "bold", color: "#fff" }}>
          {isValidUrl ? "Yes" : "No"}
        </Text>
      </View>

      <Text
        onPress={() => {
          Linking.openURL(
            `https://drive.google.com/viewerng/viewer?embedded=true&url=${file}`
          );
        }}
      >
        {file === "" ? "no file" : file}
      </Text>
      {!uploading ? (
        <Button
          title="upload"
          onPress={() => {
            getPrescriptionDoc();
            // setTimeout(() => {
            //   setUploading(false);
            // }, 5000);
            // uploadPrescriptionDoc();
          }}
        />
      ) : (
        <ActivityIndicator size="large" color="#000" />
      )}
      {isValidUrl && (
        <Button
          title="next"
          onPress={() => {
            props.navigation.navigate("OrderPreview", {
              address: addressIndex,
              fileUrl: file,
              prescriptionUploaded: isValidUrl,
              noPrescriptionRequired: false,
            });
          }}
        />
      )}
    </View>
  );
};

export default UploadPrescriptionScreen;
