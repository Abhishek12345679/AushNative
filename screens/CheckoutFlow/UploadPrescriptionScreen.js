//TODO: switch with firebase-storage

import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";

import * as Firebase from "firebase";

import storage from "@react-native-firebase/storage";

import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import DrugStore from "../../store/CartStore";

import { Platform } from "react-native";
// import { isRegExp } from "lodash";

const UploadPrescriptionScreen = (props) => {
  const [uploading, setUploading] = useState(false);
  const [prescription, setPrescription] = useState("");
  const addressIndex = props.route.params.address;

  //https://res.cloudinary.com/abhisheksah69420/raw/upload/v1606036086/Prescriptions/7WCAfGl2BiOB49OgOFxLycKFAsx2/rykh8utjw5j7wc3f4qiq
  const urlRegex = new RegExp(/^(https):\/\/[^\s$.?#].[^\s]*$/);
  const isValidUrl = urlRegex.test(prescription);
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

      // const base64File = await RNFS.readFile(uri, "base64");
      console.log(uri);
      setPrescription(uploadPrescriptionDoc(uri));
      // setUploading(false);
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

  const uploadPrescriptionDoc = async (uri) => {
    // setLoading(true);
    const ref = storage().ref(
      `/prescriptions/${new Date().toISOString()}/${
        DrugStore.userCredentials.uid
      }.jpg`
    );

    const snapshot = ref.putFile(uri);

    snapshot.on(
      Firebase.storage.TaskEvent.STATE_CHANGED,
      (s) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (s.bytesTransferred / s.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (s.state) {
          case Firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case Firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          console.log(downloadURL);
          // setLoading(false);
          setUploading(false);
          return downloadURL;
          // setImage(downloadURL);
        });
      }
    );
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
            `https://drive.google.com/viewerng/viewer?embedded=true&url=${prescription}`
          );
        }}
      >
        {/* {prescription === "" ? "no file" : prescription} */}link
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
      <Button
        title="next"
        onPress={() => {
          props.navigation.navigate("OrderPreview", {
            address: addressIndex,
            fileUrl: prescription,
            prescriptionUploaded: isValidUrl,
            noPrescriptionRequired: false,
          });
        }}
      />
    </View>
  );
};

export default UploadPrescriptionScreen;
