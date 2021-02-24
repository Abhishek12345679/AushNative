import React, { useRef, useState } from "react";
import { Button } from "react-native";
import { Image } from "react-native";
import { View, Text } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Camera } from "expo-camera";

const Test = (props) => {
  // const image = props.route.params.photo.base64;
  const [picture, setPicture] = useState("");
  const baseUri = "data:image/jpg;base64,";
  // const cameraRef = useRef().current;

  const takePicture = async () => {
    try {
      const photo = await cameraRef.takePictureAsync({
        base64: true,
        quality: 1,
      });
      if (!photo.cancelled) {
        setPicture(baseUri + image);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const pickImage = async () => {
    try {
      let photo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!photo.cancelled) {
        console.log("setting picture");
        setPicture(baseUri + photo.base64.trim());
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      <Image
        source={{
          uri: picture,
        }}
        style={{
          width: 250,
          height: 250,
          borderWidth: 1,
          borderColor: "#000",
          //   opacity: 1,
        }}
      />
      <Button title="take picture" onPress={takePicture} />
      <Button title="gallery" onPress={pickImage} />
    </View>
  );
};

export default Test;
