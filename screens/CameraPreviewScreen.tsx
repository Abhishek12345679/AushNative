//TODO: Checkout Vision Camera: <https://mrousavy.com/react-native-vision-camera/>

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";


import { Ionicons } from "@expo/vector-icons";
import CameraPreviewCornerButton from "../components/CameraPreviewCornerButton";
import { extractWords, TextRecognitionResponse } from "../mlkit/TextRecognition";
import RecognisedWordsOverlay from "../components/RecognisedWordsOverlay";

const CameraPreviewScreen = (props: any) => {

  const windowWidth = Dimensions.get("window").width;
  const [image, setImage] = useState(props.route.params.photo.uri);
  const [textRecognitionResponse, setTextRecognitonResponse] =
    useState<TextRecognitionResponse | undefined>(undefined);
  const [aspectRatio, setAspectRatio] = useState(1);

  const removeUselessSpaces = (text) => {
    let newText = text.replace(/\s+/g, " ").trim();
    return newText;
  };


  const processImage = async () => {
    if (image) {
      try {
        const TextRecognitionResponse = await extractWords(image);
        if (TextRecognitionResponse.blocks.length > 0) {
          // console.log(
          //   "TextRecognitionResponse",
          //   JSON.stringify(TextRecognitionResponse, null, 4)
          // );
          setTextRecognitonResponse(TextRecognitionResponse);
          setAspectRatio(
            TextRecognitionResponse.height /
            TextRecognitionResponse.width
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header_footer}>
        <View style={styles.buttonContainer}>
          <CameraPreviewCornerButton
            onpress={processImage}
            color="#FFF"
            text="Confirm"
          />

          <Ionicons
            name="ios-camera"
            size={30}
            color="#fff"
          />

          <CameraPreviewCornerButton
            onpress={() => {
              props.navigation.goBack();
            }}
            color="#FFF"
            text="Retake"
          />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: image }}
          style={{
            position: 'relative',
            height: windowWidth * aspectRatio,
            width: windowWidth,
          }}
          resizeMode="cover"
        />
        {!!textRecognitionResponse && (
          <RecognisedWordsOverlay
            response={textRecognitionResponse}
            scale={windowWidth / textRecognitionResponse.width}
          />
        )}
      </View>

      <View style={styles.header_footer}>
        <View style={styles.buttonContainer}>
          <CameraPreviewCornerButton
            onpress={() => {
              props.navigation.goBack();
            }}
            color="#FFF"
            text="cancel"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header_footer: {
    width: "100%",
    height: 100,
    backgroundColor: "#000",
  },
  buttonContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 40,
    marginHorizontal: 10,
    alignItems: "center",
  },
});

export default CameraPreviewScreen;
