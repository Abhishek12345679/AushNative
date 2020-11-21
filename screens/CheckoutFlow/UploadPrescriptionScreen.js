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

const UploadPrescriptionScreen = (props) => {
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const addressIndex = props.route.params.address;

  const getPrescriptionDoc = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        readContent: true,
      });
      const uri = Platform.select({
        android: res.uri,
        ios: decodeURIComponent(res.uri)?.replace?.("file://", ""),
      });

      const base64File = await RNFS.readFile(uri, "base64");
      // Your file handling here
      console.log(res);
      // console.log(base64File.substring(0, 10));
      uploadPrescriptionDoc(`data:image/jpg;base64,${base64File}`);
      // setFile(`data:image/jpg;base64,${base64File}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const uploadPrescriptionDoc = async (imageUrl) => {
    const response = await fetch("https://images-api-v1.herokuapp.com/upload", {
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
    console.log(resData);
    setFile(resData.secure_url);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: file }} style={{ width: 100, height: 100 }} />
      {/* <Text
        onPress={() => {
          Linking.openURL(
            `https://drive.google.com/viewerng/viewer?embedded=true&url=${file}`
          );
        }}
      >
        open File
      </Text> */}
      {/* {file.length > 0 && <Text>PDF</Text>} */}
      {!uploading ? (
        <Button
          title="upload"
          onPress={() => {
            setUploading(true);
            getPrescriptionDoc()
              .then(() => {
                setUploading(false);
              })
              .catch((err) => {
                // setUploading(false);
                console.error(err);
              });
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
            addressIndex: addressIndex,
            fileUrl: file,
          });
        }}
      />
    </View>
  );
};

export default UploadPrescriptionScreen;
